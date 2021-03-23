import axios from 'axios';
import { API_BASE_URL } from '../consts';
import { Meta } from '../types';

// eslint-disable-next-line import/prefer-default-export
export const getMeta = async (): Promise<Meta> => {
  const { data } = await axios.get(`${API_BASE_URL}/meta`);
  if (
    Array.isArray(data.accepted)
    && data.accepted.every((x: any): x is string => typeof x === 'string')
    && typeof data.setupFinished === 'boolean'
  ) {
    return { accepted: data.accepted, setupFinished: data.setupFinished };
  }
  console.log('truth:', Object.prototype.toString.call(data.accepted));
  console.log(data.setupFinished);
  throw new Error('Malformed server response');
};
