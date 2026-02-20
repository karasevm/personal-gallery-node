/* eslint-disable @typescript-eslint/no-unsafe-argument */
import bcrypt from 'bcryptjs';
import * as db from './db.js';
import logger from './logger.js';

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
  } catch (error: any) {
    logger.error(`validateCredentials: ${error.message}`);
    return false;
  }
};

/**
 * Validates passed password
 * @param password Plaintext password
 * @returns true if password is valid, false if it is not
 */
export const validatePassword = async (password: string) => bcrypt.compare(password, db.getMeta('password'));
