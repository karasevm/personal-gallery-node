import { Request, Router } from 'express';
import fileType from 'file-type';
import sharp from 'sharp';
import { SortBy, SortOrder, ThumbnailMeta } from '../types';
import {
  addImage,
  getImages,
  registerFileInFolder,
} from '../services/imageService';
import logger from '../utils/logger';
import { ACCEPTED_MIME } from '../utils/consts';
import { BASE_URL } from '../utils/config';

const imagesRouter = Router();

imagesRouter.post('/refresh', async (_, res) => {
  await registerFileInFolder();
  res.status(200).end();
});

class FrontEndImage {
  url: string;

  filename: string;

  thumbnails: ThumbnailMeta[];

  constructor(req: Request, filename: string) {
    this.url = encodeURI(`${BASE_URL}/${filename}`);
    this.filename = filename;
    this.thumbnails = [
      // {
      //   filetype: 'image/avif',
      //   url: `${BASE_URL}/api/thumbnails/${filename}/avif`,
      // },
      {
        filetype: 'image/webp',
        url: `${BASE_URL}/api/thumbnails/${filename}/webp`,
      },
      {
        filetype: 'image/jpeg',
        url: `${BASE_URL}/api/thumbnails/${filename}/jpeg`,
      },
    ];
  }
}

// Image listing
imagesRouter.get('/', async (req, res) => {
  let sortBy = SortBy.Name;
  switch (req.query.sortBy) {
    case 'filename':
      sortBy = SortBy.Name;
      break;
    case 'added':
      sortBy = SortBy.Date;
      break;
    default:
      break;
  }
  let sortOrder = SortOrder.Ascending;
  switch (req.query.sortOrder) {
    case 'ASC':
      sortOrder = SortOrder.Ascending;
      break;
    case 'DESC':
      sortOrder = SortOrder.Descending;
      break;
    default:
      break;
  }
  let page = 0;
  if (
    typeof req.query.page === 'string'
    && !Number.isNaN(parseInt(req.query.page, 10))
    && parseInt(req.query.page, 10) > 0
  ) {
    page = parseInt(req.query.page, 10);
  }
  logger.verbose(`Sort order:${sortOrder}`);
  res.set('Cache-Control', 'no-store, max-age=0');
  res.json(
    (await getImages(sortBy, 10, sortOrder, page)).map(
      (val) => new FrontEndImage(req, val),
    ),
  );
});

// Image upload
imagesRouter.post('/', async (req:any, res) => {
  if (req.files === undefined) {
    res.status(400).json({ status: 'error', error: 'File missing.' });
  } else if (Array.isArray(req.files.file)) {
    res.status(400).json({ status: 'error', error: 'Send one file at a time.' });
  } else {
    let imageBuffer = req.files.file.data;
    const imageName = req.files.file.name;
    const imageType = await fileType.fromBuffer(imageBuffer);
    if (imageType === undefined) {
      res.status(400).json({ status: 'error', error: 'Malformed file.' });
      return;
    }
    const { mime, ext } = imageType;
    if (mime !== req.files.file.mimetype) {
      res.status(400).json({ status: 'error', error: 'Malformed file.' });
      return;
    }
    if (!ACCEPTED_MIME.includes(mime)) {
      res.status(400).json({ status: 'error', error: 'Unsupported file type.' });
    }
    if (mime === 'image/jpeg') {
      // Strip exif from jpeg files and compress them with q=80
      imageBuffer = await sharp(req.files.file.data).jpeg().toBuffer();
    }
    try {
      // hande images here
      logger.verbose(`Got file ${imageName}`);
      const serverFileName = await addImage(imageBuffer, ext);
      res.json(new FrontEndImage(req, serverFileName));
    } catch {
      res.status(500).json({ status: 'error', error: 'Error saving uploaded image.' });
    }
  }
});

export default imagesRouter;
