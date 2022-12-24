import cacheManager from 'cache-manager';
import redisStore from 'cache-manager-ioredis';
import fsStore from 'cache-manager-fs-hash';
import {
  REDIS_HOST, REDIS_PORT, REDIS_PASSWORD, CACHE_DIR,
} from './config';
import logger from './logger';

// eslint-disable-next-line import/no-mutable-exports
let thumbnailCache: cacheManager.Cache;

if (typeof REDIS_HOST !== 'undefined') {
  thumbnailCache = cacheManager.caching({
    store: redisStore,
    host: REDIS_HOST,
    port: REDIS_PORT,
    password: REDIS_PASSWORD,
    db: 0,
    ttl: 600,
  });
} else if (typeof CACHE_DIR !== 'undefined') {
  thumbnailCache = cacheManager.caching({
    store: fsStore,
    ttl: 60 * 60 * 24 * 365, // time to life in seconds
    options: {
      path: CACHE_DIR, // path for cached files
      subdirs: true, // create subdirectories to reduce the files in a single dir (default: false)
      zip: true, // zip files to save diskspace (default: false)
    },
  });
} else {
  thumbnailCache = cacheManager.caching({
    store: 'memory',
    max: 300,
    ttl: 604800,
  });
}

logger.info(`Using cache store '${(thumbnailCache.store as any).name}'`);

export default thumbnailCache;
