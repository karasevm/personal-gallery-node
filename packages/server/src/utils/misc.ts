import * as database from './db';

export const isNonEmptyString = (input: any): input is string => typeof input === 'string' && input.length > 0;

export const isSetupFinished = () => typeof database.getMeta('username') !== 'undefined';
