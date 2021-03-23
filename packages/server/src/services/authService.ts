import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import * as db from '../utils/db';
import { validateCredentials } from '../utils/authorization';

/**
 * Checks for username and password validity,
 * generates new token, and stores it in the session store
 * @param {string} username Username
 * @param {string} password Plaintext password
 */
export const login = async (username: string, password: string) => {
  if (await validateCredentials(username, password)) {
    const token = crypto.randomBytes(30).toString('hex');
    db.insertSessionIntoDB(token);
    return token;
  }
  return null;
};

/**
 * Generates new api token, and stores it in the meta store
 */
export const generateToken = async () => {
  const token = crypto.randomBytes(30).toString('hex');
  db.setMeta('apiToken', token);
  return token;
};

/**
 * Clears sessions db and resets api token to random value
 */
export const clearSessions = async () => {
  db.clearSessionsDB();
  generateToken();
};

/**
 * Removes token from session store
 * @param {string} token login token to remove
 */
export const logout = async (token: string) => {
  db.removeSessionFromDB(token);
};

/**
 * Stores username and password hash in the meta store
 * @param {string} username Username
 * @param {string} password Plaintext password
 */
export const register = async (username: string, password: string) => {
  clearSessions();
  db.setMeta('username', username);
  db.setMeta('password', await bcrypt.hash(password, 12));
};

/**
 * Stores username in the meta store
 * @param {string} username Username
 */
export const updateUsername = async (username: string) => {
  db.setMeta('username', username);
};

/**
 * Stores password hash in the meta store
 * @param {string} password Plaintext password
 */
export const updatePassword = async (password: string) => {
  db.setMeta('password', await bcrypt.hash(password, 12));
};
