import axios from 'axios';
import {
  Image, SortBy, SortOrder, Thumbnail,
} from '../types';
import { API_BASE_URL } from '../consts';

// Type guards
const isThumbnail = (thumb: any): thumb is Thumbnail => {
  if (
    'url' in thumb
    && typeof thumb.url === 'string'
    && 'filetype' in thumb
    && typeof thumb.filetype === 'string'
  ) {
    return true;
  }
  return false;
};

const isThumbnailArray = (thumbnails: any): thumbnails is Thumbnail[] => (
  Array.isArray(thumbnails) && thumbnails.every(isThumbnail)
);

const isImage = (image: any): image is Image => {
  if (
    'url' in image
    && typeof image.url === 'string'
    && 'filename' in image
    && typeof image.url === 'string'
    && 'thumbnails' in image
    && isThumbnailArray(image.thumbnails)
  ) {
    return true;
  }
  return false;
};

const isImageArray = (images: any): images is Image[] => (
  Array.isArray(images) && images.every(isImage)
);

/**
 * Fetches list of images from the server
 * @param sortBy Attribute by which images will be sorted
 * @param sortOrder Images sort direction
 * @param page Page number
 * @return List of images
 */
export const getPage = async (
  page: number = 0,
  sortBy: SortBy = SortBy.Date,
  sortOrder: SortOrder = SortOrder.Descending,
): Promise<Image[]> => {
  const { data } = await axios.get(`${API_BASE_URL}/images`, {
    params: { page, sortBy, sortOrder },
    timeout: 5000,
  });
  if (isImageArray(data)) {
    return data;
  }
  throw new Error('Malformed response from server');
};

/**
 * Uploads an image to the server
 * @param image File  object of image you want to upload
 * @returns Meta of uploaded image
 * @throws Will throw if error occurs during upload
 */
export const uploadImage = async (image: File): Promise<Image> => {
  const formData = new FormData();
  formData.append('file', image);
  const { data } = await axios.post(`${API_BASE_URL}/images`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 10000,
  });
  if (isImage(data)) {
    return data;
  }
  throw new Error('Malformed response from server');
};
