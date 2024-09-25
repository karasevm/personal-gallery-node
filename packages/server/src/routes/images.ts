import {type Request, Router} from 'express';
import {fileTypeFromBuffer} from 'file-type';
import sharp from 'sharp';
import {SortBy, SortOrder, type ThumbnailMeta} from '../types.js';
import {
  addImage,
  getImages,
  registerFileInFolder,
} from '../services/imageService.js';
import logger from '../utils/logger.js';
import {ACCEPTED_MIME} from '../utils/consts.js';
import {BASE_URL} from '../utils/config.js';

const imagesRouter = Router();

imagesRouter.post('/refresh', async (_, response) => {
  await registerFileInFolder();
  response.status(200).end();
});

class FrontEndImage {
  url: string;

  filename: string;

  thumbnails: ThumbnailMeta[];

  constructor(request: Request, filename: string) {
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
imagesRouter.get('/', async (request, response) => {
  let sortBy = SortBy.Name;
  switch (request.query.sortBy) {
    case 'filename': {
      sortBy = SortBy.Name;
      break;
    }

    case 'added': {
      sortBy = SortBy.Date;
      break;
    }

    default: {
      break;
    }
  }

  let sortOrder = SortOrder.Ascending;
  switch (request.query.sortOrder) {
    case 'ASC': {
      sortOrder = SortOrder.Ascending;
      break;
    }

    case 'DESC': {
      sortOrder = SortOrder.Descending;
      break;
    }

    default: {
      break;
    }
  }

  let page = 0;
  if (
    typeof request.query.page === 'string'
    && !Number.isNaN(Number.parseInt(request.query.page, 10))
    && Number.parseInt(request.query.page, 10) > 0
  ) {
    page = Number.parseInt(request.query.page, 10);
  }

  logger.verbose(`Requested images. Sort by:${sortBy}. Sort order:${sortOrder}`);
  response.set('Cache-Control', 'no-store, max-age=0');
  const images = await getImages(sortBy, 10, sortOrder, page);
  response.json(
    images.map(
      value => new FrontEndImage(request, value),
    ),
  );
});

// Image upload
imagesRouter.post('/', async (request, response) => {
  if (request.files === undefined) {
    response.status(400).json({status: 'error', error: 'File missing.'});
  } else if (Array.isArray(request.files?.file)) {
    response.status(400).json({status: 'error', error: 'Send one file at a time.'});
  } else {
    let imageBuffer = request.files?.file.data;
    const imageName = request.files?.file.name;

    if (imageBuffer === undefined || imageName === undefined) {
      response.status(400).json({status: 'error', error: 'Malformed file.'});
      return;
    }

    const imageType = await fileTypeFromBuffer(imageBuffer);
    if (imageType === undefined) {
      response.status(400).json({status: 'error', error: 'Malformed file.'});
      return;
    }

    const {mime, ext} = imageType;
    if (mime !== request.files?.file.mimetype) {
      response.status(400).json({status: 'error', error: 'Malformed file.'});
      return;
    }

    if (!ACCEPTED_MIME.includes(mime)) {
      response.status(400).json({status: 'error', error: 'Unsupported file type.'});
    }

    if (mime === 'image/jpeg') {
      // Strip exif from jpeg files and compress them with q=95
      imageBuffer = await sharp(imageBuffer).jpeg({quality: 95}).toBuffer();
    }

    try {
      // Handle images here
      logger.verbose(`Got file ${imageName}`);
      const serverFileName = await addImage(imageBuffer, ext);
      response.json(new FrontEndImage(request, serverFileName));
    } catch {
      response.status(500).json({status: 'error', error: 'Error saving uploaded image.'});
    }
  }
});

export default imagesRouter;
