import fs from 'fs';
import path from 'path';
import fileType from 'file-type';
import { customAlphabet } from 'nanoid/async';
import { getImagesFromDB, insertImageIntoDB } from '../utils/db';
import logger from '../utils/logger';
import { IMAGE_DIR } from '../utils/config';
import { Image, SortBy, SortOrder } from '../types';
import { ACCEPTED_MIME } from '../utils/consts';

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 7);

/**
 * Reads all files in the directory and tries to add them to the database.
 */
export const registerFileInFolder = async () => {
  const files = fs.readdirSync(IMAGE_DIR);
  const filesWithStats = await Promise.all(
    files.map((filename) => fs.promises
      .stat(path.join(IMAGE_DIR, filename))
      .then((stat) => ({ filename, stat }))),
  );

  const filteredFilesWithStats:{
    filename: string;
    stat: fs.Stats;
  }[] = [];

  const filePromises = filesWithStats.map(async (file) => {
    const result = await fileType.fromFile(
      path.join(IMAGE_DIR, file.filename),
    );
    if (result !== undefined && ACCEPTED_MIME.includes(result.mime)) {
      filteredFilesWithStats.push(file);
    }
  });
  await Promise.all(filePromises);
  let newCount = 0;
  filteredFilesWithStats.forEach((file) => {
    try {
      insertImageIntoDB(file.filename, file.stat.mtime.getTime());
      newCount += 1;
    } catch (e) { logger.error(`${e.name}: ${e.message}`); }
  });

  logger.info(
    `Found ${filesWithStats.length} files, ${filteredFilesWithStats.length} valid images, ${newCount} new`,
  );
};

/**
 * Saves image to disk and registers it into the database
 * @param fileData Raw file data
 * @param extension File extension
 * @returns a promise with the new file name for the file
 * @throws On file write error
 */
export const addImage = async (
  fileData: Buffer,
  extension: string,
): Promise<string> => {
  const newFileName = `${await nanoid()}.${extension}`;
  const newFilePath = path.join(IMAGE_DIR, newFileName);
  logger.verbose(`Saving buffer into ${newFilePath}`);
  fs.writeFileSync(newFilePath, fileData);
  insertImageIntoDB(newFileName);
  return newFileName;
};

/**
 * Gets images from the database
 * @param sortBy Attribute by which images will be sorted
 * @param count Image count on one page
 * @param sortOrder Images sort direction
 * @param page Page number
 * @returns a promise with a list of images
 */
export const getImages = async (
  sortBy: SortBy = SortBy.Name,
  count: number = 10,
  sortOrder: SortOrder = SortOrder.Descending,
  page?: number,
): Promise<string[]> => getImagesFromDB(sortBy, sortOrder, count, page).map(
  (entry) => entry.filename,
);

/**
 * Get an image from the disk
 * @param filename image filename
 * @returns a promise with an Image object
 * @throws if no image was found
 */
export const getImage = async (filename: string): Promise<Image> => {
  try {
    logger.verbose(`Looking for file ${filename}...`);
    const file = fs.readFileSync(path.join(IMAGE_DIR, filename));
    logger.verbose('Found.');
    const type = await fileType.fromBuffer(file);
    if (type === undefined) {
      throw new Error('Error processing file.');
    }
    return { filename, imagebuffer: file, filetype: type.mime };
  } catch (err) {
    logger.verbose('Not found.');
    throw new Error(`File not found. \n${err}`);
  }
};
/**
 * Check if image exists on disk
 * @param filename image filename
 * @returns a promise with boolean, which is true if image exists, false otherwise
 */
export const imageExists = async (filename: string): Promise<boolean> => {
  try {
    if (fs.existsSync(path.join(IMAGE_DIR, filename))) {
      return true;
    }
    return false;
  } catch (err) {
    return false;
  }
};
