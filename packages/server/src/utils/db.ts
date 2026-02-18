/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/naming-convention */
import path from 'node:path';
import process from 'node:process';
import sqlite3 from 'bun:sqlite';
import { type ImageDatabaseEntry } from '../types.js';
import { DB_DIR } from './config.js';
import logger from './logger.js';

const dbPath =
  process.env.NODE_ENV === 'test' ? ':memory:' : path.join(DB_DIR, 'app.db');
logger.debug(`Attempting to store db in ${dbPath}`);

export const database = new sqlite3(dbPath);

process.on('exit', () => database.close());
process.on('SIGHUP', () => process.exit(128 + 1));
process.on('SIGINT', () => process.exit(128 + 2));
process.on('SIGTERM', () => process.exit(128 + 15));

database
  .prepare(
    'CREATE TABLE IF NOT EXISTS images (id INTEGER PRIMARY KEY AUTOINCREMENT, filename TEXT UNIQUE, added INTEGER)'
  )
  .run();
database
  .prepare(
    'CREATE TABLE IF NOT EXISTS sessions (id INTEGER PRIMARY KEY AUTOINCREMENT, session TEXT)'
  )
  .run();
database
  .prepare('CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY, value TEXT)')
  .run();

/**
 * Inserts provided image data into the database
 * @param filename Name of the image file
 * @param addedTimestamp Image upload timestamp
 * @throws Will throw if filename already exists in the database
 */
export const insertImageIntoDB = (
  filename: string,
  addedTimestamp: number = Date.now()
) => {
  const result = database
    .prepare('SELECT EXISTS(SELECT filename FROM images WHERE filename=?)')
    .get(filename) as Record<string, unknown>;
  if (result['EXISTS(SELECT session FROM sessions WHERE session=?)'] === 1) {
    throw new Error('file already exists');
  }

  const stmt = database.prepare(
    'INSERT INTO images (filename,added) VALUES (?,?)'
  );
  stmt.run(filename, addedTimestamp);
};

/**
 * Gets a list of images from the database according to the parameters
 * @param order Attribute by which images will be sorted
 * @param orderDirection Images sort direction
 * @param limit Image count on one page
 * @param page Page number
 * @returns Array of images according to the requested parameters
 */
export const getImagesFromDB = (
  order: 'added' | 'filename',
  orderDirection: 'ASC' | 'DESC',
  limit = 10,
  page = 0
): ImageDatabaseEntry[] => {
  logger.verbose(`${order}, ${orderDirection}, ${limit}, ${page}`);
  const stmt = database.prepare(
    `SELECT * FROM images ORDER BY ${order} ${orderDirection} LIMIT ? OFFSET ?`
  );
  return stmt.all(limit, page * limit) as ImageDatabaseEntry[];
};

/**
 * Inserts session into the sessions table
 * @param session Session to insert
 */
export const insertSessionIntoDB = (session: string) => {
  database.prepare('INSERT INTO sessions (session) VALUES (?)').run(session);
};

/**
 * Removes a single session from the sessions table
 * @param session Session to remove
 */
export const removeSessionFromDB = (session: string) => {
  database.prepare('DELETE FROM sessions WHERE session = (?)').run(session);
};

/**
 * Checks if session key exist in the sessions table
 * @param session Session to check
 * @returns true if exists, false otherwise
 */
export const sessionExists = (session: string) => {
  const result = database
    .prepare('SELECT EXISTS(SELECT session FROM sessions WHERE session=?)')
    .get(session) as Record<string, unknown>;
  if (result['EXISTS(SELECT session FROM sessions WHERE session=?)'] === 1) {
    return true;
  }

  return false;
};

/**
 * Removes all sessions from the sessions table
 */
export const clearSessionsDB = () => {
  database.prepare('DELETE FROM sessions').run();
};

// Meta - key value store backed by a sqlite table
interface MetaValue {
  key: string;
  value: string;
}
/**
 * Sets a meta value
 */
export const setMeta = (key: string, value: string) => {
  database
    .prepare('REPLACE INTO meta (key, value) values (?,?)')
    .run(key, value);
};

/**
 * Gets a meta value
 * @returns Value assigned to key, undefined otherwise
 */
export const getMeta = (key: string) =>
  (
    database
      .prepare('SELECT value FROM meta WHERE key = ?')
      .get(key) as MetaValue | null
  )?.value;

/**
 * Deletes a meta key value pair
 */
export const deleteMeta = (key: string) => {
  database.prepare('DELETE FROM meta WHERE key = ?').run(key);
};
