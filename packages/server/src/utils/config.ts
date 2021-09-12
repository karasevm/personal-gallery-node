import * as dotenv from 'dotenv';
import { sync as commandExists } from 'command-exists';
import path from 'path';

dotenv.config();

export const PORT: number = parseInt(process.env.PORT || '3001', 10);
export const IMAGE_DIR: string = (process.env.NODE_ENV === 'test')
  ? path.join(process.cwd(), 'test', 'i')
  : process.env.IMAGE_DIR || path.join(process.cwd(), 'tmp');
export const DB_DIR: string = process.env.DB_DIR || path.join(process.cwd(), 'tmp');
export const FFMPEG_EXISTS: boolean = commandExists('ffmpeg');
export const BASE_URL: string = process.env.BASE_URL || '';
export const { REDIS_HOST } = process.env;
export const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379', 10);
export const { REDIS_PASSWORD } = process.env;
export const { CACHE_DIR } = process.env;
export const PROXY = process.env.PROXY || true;
export const { USERNAME } = process.env;
export const { PASSWORD } = process.env;
export const FULLS_AS_THUMBS = process.env.FULLS_AS_THUMBS === 'true' || false;
