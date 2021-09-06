import bcrypt from 'bcryptjs';
import * as db from './db';
import logger from './logger';

/**
 * Validates passed credentials
 * @param username Username
 * @param password Plaintext password
 * @returns true if credentials are valid, false if they are not
 */
export const validateCredentials = async (
  username: string,
  password: string,
) => {
  try {
    return (await bcrypt.compare(password, db.getMeta('password')))
    && username === db.getMeta('username');
  } catch (e:any) {
    logger.error(`validateCredentials: ${e.message}`);
    return false;
  }
};

/**
 * Validates passed password
 * @param password Plaintext password
 * @returns true if password is valid, false if it is not
 */
export const validatePassword = async (password: string) => bcrypt.compare(password, db.getMeta('password'));
