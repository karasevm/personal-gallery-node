import cacheManager from 'cache-manager';
import redisStore from 'cache-manager-ioredis';
import { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } from './config';
import logger from './logger';

// eslint-disable-next-line import/prefer-default-export
export const thumbnailCache = typeof REDIS_HOST === 'undefined'
  ? cacheManager.caching({
    store: 'memory',
    max: 300,
    ttl: 604800,
  })
  : cacheManager.caching({
    store: redisStore,
    host: REDIS_HOST,
    port: REDIS_PORT,
    password: REDIS_PASSWORD,
    db: 0,
    ttl: 600,
  });

logger.info(`Using cache store '${(thumbnailCache.store as any).name}'`);
