import { Router } from 'express';
import logger from '../utils/logger';
import { imageExists } from '../services/imageService';
import { thumbnailCache } from '../utils/cache';
import { getThumbnail } from '../services/thumbnailService';

const thumbnailsRouter = Router();

thumbnailsRouter.get('/:image/:type', async (req, res) => {
  try {
    if (!imageExists(req.params.image)) {
      throw new Error('Not found.');
    }
    const result = (await thumbnailCache.wrap(
      `${req.params.image}${req.params.type}`,
      () => getThumbnail(req.params.image, req.params.type),
    )) as any;
    // cache-manager returns different types based on the backend,
    // so we manually check how we should treat the result
    if (result instanceof Buffer) {
      res.set('Cache-Control', 'private, max-age=2592000');
      res.end(result, 'binary');
    } else if (result?.type === 'Buffer') {
      // hack for handling object returned from redis
      res.set('Cache-Control', 'private, max-age=2592000');
      res.end(Buffer.from(result.data), 'binary');
    } else {
      throw new Error('Unknow object type');
    }
  } catch (err) {
    logger.error(err);
    res.status(404).json({ error: 'Not found.' });
  }
});

thumbnailsRouter.get('/', async (req, res) => {
  res.status(400).json({ error: 'No file specified.' });
});

export default thumbnailsRouter;
