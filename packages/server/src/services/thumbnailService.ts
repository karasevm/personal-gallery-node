/* eslint-disable import/prefer-default-export */
import sharp from 'sharp';
import ffmpeg from 'fluent-ffmpeg';
import tmp from 'tmp';
import fs from 'fs';
import util from 'util';
import path from 'path';
import { FFMPEG_EXISTS, IMAGE_DIR } from '../utils/config';
import { getImage } from './imageService';
import logger from '../utils/logger';

/**
 * Promisified fluent-ffmpeg screenshots call
 * @param filepath path to the source file
 * @param folder path to the output folder
 * @returns a promise with an array of created filenames
 */
const ffmpegScreenshotPromise = (
  filepath: string,
  folder: string,
): Promise<string[]> => new Promise((resolve) => {
  const ffmpegCommand = ffmpeg(`${filepath}`);
  let resultArray: string[] = [];
  ffmpegCommand
    .screenshots({
      count: 1,
      filename: 'temp.png',
      folder,
    })
    .on('end', () => {
      resolve(resultArray);
    })
    .on('error', () => {
      throw new Error('FFmpeg error.');
    })
    .on('filenames', (arr) => {
      resultArray = arr;
    });
});
/**
 * Asyncronously generate thumbnail for file with given dimensions
 * @param filename Input file name
 * @param thumbnailFormat Thumbnail format
 * @param width Thumbnail width
 * @param height Thumbnail height
 * @return a promise with the thumbnail buffer
 * @throws If called on video file with no ffmpeg available
 */
export const getThumbnail = async (
  filename: string,
  thumbnailFormat: string,
  fullsAsThumbs: boolean,
  width: number = 210,
  height: number = 160,
): Promise<Buffer> => {
  const image = await getImage(filename);
  const readFilePromise = util.promisify(fs.readFile);
  const unlinkFilePromise = util.promisify(fs.unlink);
  let { imagebuffer } = image;
  logger.verbose('Thumbnail cache miss.');
  // Take a screenshot from videos
  if (image.filetype.startsWith('video')) {
    if (!FFMPEG_EXISTS) {
      throw new Error(
        'Attempted to create thumbnail for video without ffmpeg installed.',
      );
    }
    const tmpDir = tmp.dirSync();
    try {
      await ffmpegScreenshotPromise(
        path.join(IMAGE_DIR, filename),
        tmpDir.name,
      );
      imagebuffer = await readFilePromise(`${tmpDir.name}/temp.png`);
      await unlinkFilePromise(`${tmpDir.name}/temp.png`);
    } catch (e: any) {
      logger.error(`${e.name}:${e.message}`);
    }
    tmpDir.removeCallback();
  }
  if (fullsAsThumbs) {
    return imagebuffer;
  }
  // Convert the buffer into requested format
  switch (thumbnailFormat) {
    case 'jpeg':
      return sharp(imagebuffer)
        .resize(width, height, { fit: 'outside' })
        .jpeg({ quality: 60 })
        .toBuffer();
    case 'webp':
      return sharp(imagebuffer)
        .resize(width, height, { fit: 'outside' })
        .webp()
        .toBuffer();
    case 'avif':
      return sharp(imagebuffer)
        .resize(width, height, { fit: 'outside' })
        .avif()
        .toBuffer();
    default:
      throw new Error(`Unknown filetype ${thumbnailFormat}.`);
  }
};
