import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import fileUpload from 'express-fileupload';
import fileType from 'file-type';
import thumbnailsRouter from './routes/thumbnails';
import imagesRouter from './routes/images';
import metaRouter from './routes/meta';
import loginRouter from './routes/login';
import userRouter from './routes/user';
import { getImage, registerFileInFolder } from './services/imageService';
import { requireAuth } from './utils/middlewares';
import { register } from './services/authService';
import logger from './utils/logger';

import * as config from './utils/config';
import { isNonEmptyString } from './utils/misc';

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
  handler: (_req, res) => {
    res.status(429).json({ status: 'ratelimit' });
  },
  onLimitReached: (req) => logger.warn(`${req.ip} hit rate limit`),
});
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', config.PROXY);

app.use(express.static('public'));
app.use('/api/images', requireAuth, fileUpload(), imagesRouter);
app.use('/api/thumbnails', requireAuth, thumbnailsRouter);
app.use('/api/meta', metaRouter);
app.use('/api/login', rateLimiter, loginRouter);
app.use('/api/user', requireAuth, userRouter);
app.get('/:id', async (req, res) => {
  try {
    const buffer = (await getImage(req.params.id)).imagebuffer;
    const imageType = await fileType.fromBuffer(buffer);
    if (imageType === undefined) {
      res.redirect('/');
      return;
    }
    const { mime } = imageType;
    res.type(mime);
    res.end(buffer, 'binary');
  } catch (err) {
    res.redirect('/');
  }
});
registerFileInFolder();
if (isNonEmptyString(config.USERNAME) && isNonEmptyString(config.PASSWORD)) {
  logger.warn('Using credentials passend in the environment, sessions cleared');
  register(config.USERNAME, config.PASSWORD);
}
export default app;
