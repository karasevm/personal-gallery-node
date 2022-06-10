import axios from 'axios';
import { API_BASE_URL } from '../consts';
import { hasKey } from './common';

const isApiToken = (data: unknown): data is {
  token: string
} => typeof data === 'object'
  && data != null
  && hasKey('token', data)
  && typeof data.token === 'string';

export const getApiKey = async (): Promise<string> => {
  const response = await axios.post(`${API_BASE_URL}/user/getApiKey`);
  if (isApiToken(response.data)) {
    return response.data.token;
  }
  throw new Error('Malformed server response');
};

const isStatus = (data: unknown): data is {
  status: string
} => typeof data === 'object'
  && data != null
  && hasKey('status', data)
  && typeof data.status === 'string';

export const updateCredentials = async (
  oldPassword: string,
  username: string,
  password: string,
) => {
  const response = await axios.post(
    `${API_BASE_URL}/user/updateCredentials`,
    {
      ...(username !== '' ? { username } : {}),
      ...(password !== '' ? { password } : {}),
      oldPassword,
    },
    {},
  );
  if (!isStatus(response.data) || response.data.status !== 'success') {
    throw new Error('Malformed server response');
  }
};
