import {type Stats, promises as fs} from 'node:fs';
import path from 'node:path';
import {fileTypeFromBuffer, fileTypeFromFile} from 'file-type';
import sanitize from 'sanitize-filename';
import {customAlphabet} from 'nanoid';
import {getImagesFromDB, insertImageIntoDB} from '../utils/db.js';
import logger from '../utils/logger.js';
import {IMAGE_DIR} from '../utils/config.js';
import {type Image, SortBy, SortOrder} from '../types.js';
import {ACCEPTED_MIME} from '../utils/consts.js';

const alphabet
  = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 7);

/**
 * Reads all files in the directory and tries to add them to the database.
 */
export const registerFileInFolder = async () => {
  try {
    const files = await fs.readdir(IMAGE_DIR);
    const filesWithStats = await Promise.all(files.map(async filename =>
      fs
        .stat(path.join(IMAGE_DIR, filename))
        .then(stat => ({filename, stat}))));

    const filteredFilesWithStats: Array<{
      filename: string;
      stat: Stats;
    }> = [];

    const filePromises = filesWithStats.map(async file => {
      const result = await fileTypeFromFile(path.join(IMAGE_DIR, file.filename));
      if (result !== undefined && ACCEPTED_MIME.includes(result.mime)) {
        filteredFilesWithStats.push(file);
      }
    });
    await Promise.all(filePromises);
    let newCount = 0;
    for (const file of filteredFilesWithStats) {
      try {
        insertImageIntoDB(file.filename, file.stat.mtime.getTime());
        newCount += 1;
      } catch (error: any) {
        logger.error(`${error.name}: ${error.message}`);
      }
    }

    logger.info(`Found ${filesWithStats.length} files, ${filteredFilesWithStats.length} valid images, ${newCount} new`);
  } catch (error: any) {
    logger.error(`Error while registering files ${error.message}`);
  }
};

/**
 * Saves image to disk and registers it into the database
 * @param fileData Raw file data
 * @param extension File extension
 * @returns a promise with the new file name for the file
 * @throws On file write error
 */
export const addImage = async (
  fileData: Uint8Array,
  extension: string,
): Promise<string> => {
  const newFileName = `${await nanoid()}.${extension}`;
  const newFilePath = path.join(IMAGE_DIR, newFileName);
  logger.verbose(`Saving buffer into ${newFilePath}`);
  await fs.writeFile(newFilePath, fileData);
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
  count = 10,
  sortOrder: SortOrder = SortOrder.Descending,
  page?: number,
): Promise<string[]> =>
  getImagesFromDB(sortBy, sortOrder, count, page).map(entry => entry.filename);

/**
 * Get an image from the disk
 * @param filename image filename
 * @returns a promise with an Image object
 * @throws if no image was found
 */
export const getImage = async (filename: string): Promise<Image> => {
  try {
    logger.verbose(`Looking for file ${filename}...`);
    const file = await fs.readFile(path.join(IMAGE_DIR, sanitize(filename)));
    logger.verbose('Found.');
    const type = await fileTypeFromBuffer(file);
    if (type === undefined) {
      throw new Error('Error processing file.');
    }

    return {filename, imagebuffer: file, filetype: type.mime};
  } catch (error) {
    logger.verbose('Not found.');
    throw new Error(`File not found. \n${error}`); // eslint-disable-line @typescript-eslint/restrict-template-expressions
  }
};

/**
 * Check if image exists on disk
 * @param filename image filename
 * @returns a promise with boolean, which is true if image exists, false otherwise
 */
export const imageExists = async (filename: string): Promise<boolean> => {
  try {
    if (
      await fs
        .access(path.join(IMAGE_DIR, sanitize(filename)), fs.constants.F_OK)
        .then(() => true)
        .catch(() => false)
    ) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
};
