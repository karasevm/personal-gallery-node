import { Router } from 'express';
import fileType from 'file-type';
import logger from '../utils/logger';
import { imageExists } from '../services/imageService';
import thumbnailCache from '../utils/cache';
import { getThumbnail } from '../services/thumbnailService';
import { FULLS_AS_THUMBS } from '../utils/config';

const thumbnailsRouter = Router();

thumbnailsRouter.get('/:image/:type', async (req, res) => {
  try {
    if (!imageExists(req.params.image)) {
      throw new Error('Not found.');
    }
    let result:any;
    // dont cache thumbs if using fulls
    if (FULLS_AS_THUMBS) {
      result = await getThumbnail(req.params.image, req.params.type, true);
    } else {
      result = (await thumbnailCache.wrap(
        `${req.params.image}${req.params.type}`,
        () => getThumbnail(req.params.image, req.params.type, false),
      )) as any;
    }
    // cache-manager returns different types based on the backend,
    // so we manually check how we should treat the result
    if (result instanceof Buffer) {
      res.set('Cache-Control', 'private, max-age=2592000');
      const imageType = await fileType.fromBuffer(result);
      if (imageType === undefined) {
        throw new Error('file-type error');
      }
      const { mime } = imageType;
      res.type(mime);
      res.end(result, 'binary');
    } else if (result?.type === 'Buffer') {
      // hack for handling object returned from redis
      res.set('Cache-Control', 'private, max-age=2592000');
      const data = Buffer.from(result.data);
      const imageType = await fileType.fromBuffer(data);
      if (imageType === undefined) {
        throw new Error('file-type error');
      }
      const { mime } = imageType;
      res.type(mime);
      res.end(data, 'binary');
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
