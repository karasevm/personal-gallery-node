import { FFMPEG_EXISTS } from './config';

export const VIDEO_MIME = ['video/mp4', 'video/webm'];

export const IMAGE_MIME = [
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
  'image/jpeg',
];

export const ACCEPTED_MIME = FFMPEG_EXISTS
  ? IMAGE_MIME.concat(VIDEO_MIME)
  : IMAGE_MIME;
