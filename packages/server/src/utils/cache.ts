import path from 'node:path';
import {createCache} from 'cache-manager';
import {Keyv} from 'keyv';
import {Redis} from 'ioredis';
import KeyvRedis from '@keyv/redis';
import {KeyvSqlite} from '@keyv/sqlite';
import {
  REDIS_HOST, REDIS_PORT, REDIS_USERNAME, REDIS_PASSWORD, CACHE_DIR,
} from './config.js';
import logger from './logger.js';

// eslint-disable-next-line import/no-mutable-exports
let thumbnailCache: ReturnType<typeof createCache>;

if (REDIS_HOST !== undefined) {
  // Define redis cache
  const redis = new Redis({
    host: REDIS_HOST,
    port: REDIS_PORT,
    username: REDIS_USERNAME,
    password: REDIS_PASSWORD,
    db: 0,
  });
  thumbnailCache = createCache({
    stores: [new Keyv(new KeyvRedis(redis))],
    ttl: 60 * 60 * 24 * 365,
  });
  logger.info(`Using cache store KeyvRedis on ${REDIS_HOST}:${REDIS_PORT}`);
} else if (CACHE_DIR === undefined) {
  // Define memory cache
  thumbnailCache = createCache({
    stores: [new Keyv()],
    ttl: 60 * 60 * 24 * 365,
  });
  logger.info('Using cache store memory');
} else {
  // Define sqlite cache
  const keyv = new Keyv(new KeyvSqlite(path.join(CACHE_DIR, 'thumbnails.sqlite')));
  thumbnailCache = createCache({
    stores: [keyv],
    ttl: 60 * 60 * 24 * 365,
  });
  logger.info(`Using cache store KeyvSqlite on ${path.join(CACHE_DIR, 'thumbnails.sqlite')}`);
}

export default thumbnailCache;
