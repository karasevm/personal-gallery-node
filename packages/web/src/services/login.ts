import axios, {isAxiosError} from 'axios';
import {API_BASE_URL} from '../consts';

/**
 *
 * @param username Plaintext username
 * @param password Plaintext password
 * @returns http status code
 */
export const doLogin = async (
  username: string,
  password: string,
): Promise<number> => {
  try {
    const {status} = await axios.post(
      `${API_BASE_URL}/login`,
      {
        username,
        password,
      },
      {
        validateStatus: statusCode => statusCode >= 200 && statusCode < 500,
      },
    );
    return status;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(error);
      return error?.response?.status ?? 500;
    }

    return 500;
  }
};

export const doRegister = async (
  username: string,
  password: string,
): Promise<number> => {
  try {
    const {status} = await axios.post(
      `${API_BASE_URL}/login/register`,
      {
        username,
        password,
      },
      {
        validateStatus: statusCode => statusCode >= 200 && statusCode < 500,
      },
    );
    return status;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(error);
      return error?.response?.status ?? 500;
    }

    return 500;
  }
};

export const doLogout = async () => {
  try {
    await axios.post(`${API_BASE_URL}/login/logout`);
  } catch (error) {
    console.error(error);
  }
};
