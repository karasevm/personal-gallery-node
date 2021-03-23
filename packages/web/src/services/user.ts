import axios from 'axios';
import { API_BASE_URL } from '../consts';

export const getApiKey = async (): Promise<string> => {
  const { data } = await axios.post(`${API_BASE_URL}/user/getApiKey`);
  if (typeof data?.token === 'string') {
    return data.token;
  }
  throw new Error('Malformed server response');
};

export const updateCredentials = async (
  oldPassword: string,
  username: string,
  password: string,
) => {
  console.log('username:', username, ' password:', password);
  const { data } = await axios.post(
    `${API_BASE_URL}/user/updateCredentials`,
    {
      ...(username !== '' ? { username } : {}),
      ...(password !== '' ? { password } : {}),
      oldPassword,
    },
    {},
  );
  if (data.status !== 'success') {
    throw new Error('Malformed server response');
  }
};
