import {Router} from 'express';
import {fileTypeFromBuffer} from 'file-type';
import logger from '../utils/logger.js';
import {imageExists} from '../services/imageService.js';
import thumbnailCache from '../utils/cache.js';
import {getThumbnail} from '../services/thumbnailService.js';
import {FULLS_AS_THUMBS} from '../utils/config.js';

const thumbnailsRouter = Router();

thumbnailsRouter.get('/:image/:type', async (request, response) => {
  try {
    if (!(await imageExists(request.params.image))) {
      throw new Error('Not found.');
    }

    let result: Uint8Array;
    // Dont cache thumbs if using fulls
    if (FULLS_AS_THUMBS) {
      result = await getThumbnail(
        request.params.image,
        request.params.type,
        true,
      );
    } else {
      result = (await thumbnailCache.wrap(
        `${request.params.image}${request.params.type}`,
        async () =>
          getThumbnail(request.params.image, request.params.type, false),
      ));
    }

    response.set('Cache-Control', 'private, max-age=2592000');
    const imageType = await fileTypeFromBuffer(result);
    if (imageType === undefined) {
      throw new Error('file-type error');
    }

    const {mime} = imageType;
    response.type(mime);
    response.end(result, 'binary');

    // Cache-manager returns different types based on the backend,
    // so we manually check how we should treat the result
    // if (result instanceof Buffer) {
    //   response.set('Cache-Control', 'private, max-age=2592000');
    //   const imageType = await fileTypeFromBuffer(result);
    //   if (imageType === undefined) {
    //     throw new Error('file-type error');
    //   }

    //   const {mime} = imageType;
    //   response.type(mime);
    //   response.end(result, 'binary');
    // } else if (result?.type === 'Buffer') {
    //   // Hack for handling object returned from redis
    //   response.set('Cache-Control', 'private, max-age=2592000');
    //   const data = Buffer.from(result.data);
    //   const imageType = await fileTypeFromBuffer(data);
    //   if (imageType === undefined) {
    //     throw new Error('file-type error');
    //   }

    //   const {mime} = imageType;
    //   response.type(mime);
    //   response.end(data, 'binary');
    // } else {
    //   throw new Error('Unknow object type');
    // }
  } catch (error) {
    logger.error(error);
    response.status(404).json({error: 'Not found.'});
  }
});

thumbnailsRouter.get('/', async (_, response) => {
  response.status(400).json({error: 'No file specified.'});
});

export default thumbnailsRouter;
