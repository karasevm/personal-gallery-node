import process from 'node:process';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import fileUpload from 'express-fileupload';
import {fileTypeFromBuffer} from 'file-type';
import thumbnailsRouter from './routes/thumbnails.js';
import imagesRouter from './routes/images.js';
import metaRouter from './routes/meta.js';
import loginRouter from './routes/login.js';
import userRouter from './routes/user.js';
import {getImage, registerFileInFolder} from './services/imageService.js';
import {requireAuth} from './utils/middlewares.js';
import {register} from './services/authService.js';
import logger from './utils/logger.js';
import * as config from './utils/config.js';
import {isNonEmptyString} from './utils/misc.js';

const app = express();
if (process.env.NODE_ENV === 'dev') {
  app.use(cors());
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

const rateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  handler(_request, response) {
    response.status(429).json({status: 'ratelimit'});
  },
  onLimitReached: request => logger.warn(`${request.ip} hit rate limit`),
});
// Const speedLimiter = slowDown({
//   windowMs: 60 * 1000, // 15 minutes
//   delayAfter: 2, // allow 100 requests per 15 minutes, then...
//   delayMs: 100, // begin adding 500ms of delay per request above 100:
// });

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));
app.set('trust proxy', config.PROXY);

app.use(express.static('public'));
app.use('/api/images', requireAuth, fileUpload(), imagesRouter);
app.use('/api/thumbnails', requireAuth, thumbnailsRouter);
app.use('/api/meta', metaRouter);
app.use('/api/login', rateLimiter, loginRouter);
app.use('/api/user', requireAuth, userRouter);
app.get('/:id', async (request, response) => {
  try {
    const image = await getImage(request.params.id);
    const buffer = image.imagebuffer;
    const imageType = await fileTypeFromBuffer(buffer);
    if (imageType === undefined) {
      response.redirect('/');
      return;
    }

    const {mime} = imageType;
    response.type(mime);
    response.end(buffer, 'binary');
  } catch {
    response.redirect('/');
  }
});
void registerFileInFolder();
if (isNonEmptyString(config.USERNAME) && isNonEmptyString(config.PASSWORD)) {
  logger.warn('Using credentials passend in the environment, sessions cleared');
  void register(config.USERNAME, config.PASSWORD);
}

export default app;
