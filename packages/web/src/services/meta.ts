import axios from 'axios';
import { API_BASE_URL } from '../consts';
import { Meta } from '../types';
import { hasKey } from './common';

const isMeta = (data: unknown): data is Meta => typeof data === 'object'
    && data != null
    && hasKey('accepted', data)
    && Array.isArray(data.accepted)
    && data.accepted.every((x: unknown): x is string => typeof x === 'string')
    && hasKey('setupFinished', data)
    && typeof data.setupFinished === 'boolean';

// eslint-disable-next-line import/prefer-default-export
export const getMeta = async (): Promise<Meta> => {
  const response = await axios.get(`${API_BASE_URL}/meta`);
  if (
    isMeta(response.data)
  ) {
    return response.data;
  }
  throw new Error('Malformed server response');
};
