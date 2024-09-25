import type express from 'express';
import {getMeta, sessionExists} from './db.js';
import {isNonEmptyString} from './misc.js';

export const requireAuth = (
  request: express.Request,
  response: express.Response,
  next: express.NextFunction,
) => {
  if (
    request.headers.authorization
    && request.headers.authorization.split(' ')[0] === 'Bearer'
    && request.headers.authorization.split(' ')[1] === getMeta('apiToken')
  ) {
    next();
    return;
  }

  const token = request.cookies['personal-gallery_auth'] as unknown;
  if (isNonEmptyString(token) && sessionExists(token)) {
    next();
  } else {
    response.status(401).json({error: 'Unauthorized'});
  }
};

export const globalHeaders = (
  _request: express.Request,
  response: express.Response,
  next: express.NextFunction,
) => {
  response.set('Referrer-Policy', 'no-referrer');
  next();
};
