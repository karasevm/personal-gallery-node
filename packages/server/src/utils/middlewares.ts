import express from 'express';
import { getMeta, sessionExists } from './db';

export const requireAuth = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  if (
    req.headers.authorization
    && req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    if (req.headers.authorization.split(' ')[1] === getMeta('apiToken')) {
      next();
      return;
    }
  }
  const token = req.cookies['personal-gallery_auth'];
  if (sessionExists(token)) {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

export const globalHeaders = (
  _req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  res.set('Referrer-Policy', 'no-referrer');
  next();
};
