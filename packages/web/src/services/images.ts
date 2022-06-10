import axios from 'axios';
import {
  Image, SortBy, SortOrder, Thumbnail,
} from '../types';
import { API_BASE_URL } from '../consts';
import { hasKey } from './common';

// Type guards
const isThumbnail = (thumb: unknown): thumb is Thumbnail => {
  if (
    typeof thumb === 'object'
    && thumb !== null
    && hasKey('url', thumb)
    && typeof thumb.url === 'string'
    && hasKey('filetype', thumb)
    && typeof thumb.filetype === 'string'
  ) {
    return true;
  }
  return false;
};

const isThumbnailArray = (thumbnails: unknown): thumbnails is Thumbnail[] => (
  Array.isArray(thumbnails) && thumbnails.every(isThumbnail)
);

const isImage = (image: unknown): image is Image => {
  if (
    typeof image === 'object'
    && image !== null
    && hasKey('url', image)
    && typeof image.url === 'string'
    && hasKey('filename', image)
    && typeof image.url === 'string'
    && hasKey('thumbnails', image)
    && isThumbnailArray(image.thumbnails)
  ) {
    return true;
  }
  return false;
};

const isImageArray = (images: unknown): images is Image[] => (
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
  page = 0,
  sortBy: SortBy = SortBy.Date,
  sortOrder: SortOrder = SortOrder.Descending,
): Promise<Image[]> => {
  const response = await axios.get(`${API_BASE_URL}/images`, {
    params: { page, sortBy, sortOrder },
    timeout: 5000,
  });
  if (isImageArray(response?.data)) {
    return response.data;
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
  const response = await axios.post(`${API_BASE_URL}/images`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 10000,
  });
  if (isImage(response?.data)) {
    return response.data;
  }
  throw new Error('Malformed response from server');
};
