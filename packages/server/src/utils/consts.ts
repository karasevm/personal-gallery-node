/* eslint-disable @typescript-eslint/naming-convention */
import {FFMPEG_EXISTS} from './config.js';

export const VIDEO_MIME = ['video/mp4', 'video/webm'];

export const IMAGE_MIME = [
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
  'image/jpeg',
];

export const ACCEPTED_MIME = FFMPEG_EXISTS
  ? [...IMAGE_MIME, ...VIDEO_MIME]
  : IMAGE_MIME;
