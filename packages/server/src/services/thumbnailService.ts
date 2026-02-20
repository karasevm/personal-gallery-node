import {promises as fs} from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import ffmpeg from 'fluent-ffmpeg';
import tmp from 'tmp';
import {FFMPEG_EXISTS, IMAGE_DIR} from '../utils/config.js';
import logger from '../utils/logger.js';
import {isNonEmptyString} from '../utils/misc.js';
import {getImage} from './imageService.js';

/**
 * Promisified fluent-ffmpeg screenshots call
 * @param filepath path to the source file
 * @param folder path to the output folder
 * @returns a promise with an array of created filenames
 */
const ffmpegScreenshotPromise = async (
  filepath: string,
  folder: string,
): Promise<string[]> => new Promise(resolve => {
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
    .on('filenames', array => {
      if (Array.isArray(array) && array.every(item => isNonEmptyString(item))) {
        resultArray = array;
      }
    });
});
/**
 * Asyncronously generate thumbnail for file with given dimensions
 * @param filename Input file name
 * @param thumbnailFormat Thumbnail format
 * @param width Thumbnail width
 * @param height Thumbnail height
 * @returns a promise with the thumbnail buffer
 * @throws If called on video file with no ffmpeg available
 */
export const getThumbnail = async (
  filename: string,
  thumbnailFormat: string,
  fullsAsThumbs: boolean,
  width = 210,
  height = 160,
): Promise<Uint8Array> => {
  const image = await getImage(filename);
  let {imagebuffer} = image;
  logger.verbose('Thumbnail cache miss.');
  // Take a screenshot from videos
  if (image.filetype.startsWith('video')) {
    if (!FFMPEG_EXISTS) {
      throw new Error('Attempted to create thumbnail for video without ffmpeg installed.');
    }

    const tmpDir = tmp.dirSync(); // eslint-disable-line unicorn/prevent-abbreviations
    try {
      await ffmpegScreenshotPromise(
        path.join(IMAGE_DIR, filename),
        tmpDir.name,
      );
      imagebuffer = await fs.readFile(`${tmpDir.name}/temp.png`);
      await fs.unlink(`${tmpDir.name}/temp.png`);
    } catch (error: any) {
      logger.error(`${error.name}:${error.message}`);
    }

    tmpDir.removeCallback();
  }

  if (fullsAsThumbs) {
    return imagebuffer;
  }

  // Convert the buffer into requested format
  switch (thumbnailFormat) {
    case 'jpeg': {
      return sharp(imagebuffer)
        .resize(width, height, {fit: 'outside'})
        .jpeg({quality: 60})
        .toBuffer();
    }

    case 'webp': {
      return sharp(imagebuffer)
        .resize(width, height, {fit: 'outside'})
        .webp()
        .toBuffer();
    }

    case 'avif': {
      return sharp(imagebuffer)
        .resize(width, height, {fit: 'outside'})
        .avif()
        .toBuffer();
    }

    default: {
      throw new Error(`Unknown filetype ${thumbnailFormat}.`);
    }
  }
};
