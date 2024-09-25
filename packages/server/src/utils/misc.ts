import * as database from './db.js';

export const isNonEmptyString = (input: any): input is string => typeof input === 'string' && input.length > 0;

export const isSetupFinished = () => database.getMeta('username') !== undefined;
