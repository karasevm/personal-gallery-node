import process from 'node:process';
import {Router} from 'express';
import * as authService from '../services/authService.js';
import {isSetupFinished, isNonEmptyString} from '../utils/misc.js';

const loginRouter = Router();

loginRouter.post('/', async (request, response) => {
  if (!isSetupFinished()) {
    response.status(500).json({status: 'error'});
    return;
  }

  const {username, password} = request.body as {username: unknown; password: unknown};
  if (!isNonEmptyString(username) || !isNonEmptyString(password)) {
    response.status(400).send({status: 'error'});
    return;
  }

  const result = await authService.login(username, password);
  if (result === null) {
    response.status(401).send({status: 'error'});
  } else {
    response.cookie('personal-gallery_auth', result, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(new Date().setFullYear(new Date().getFullYear() + 3)),
    });
    response.status(200).json({status: 'success'});
  }
});

loginRouter.post('/register', async (request, response) => {
  if (isSetupFinished()) {
    response.status(403).json({status: 'already_registered'});
    return;
  }

  const {username, password} = request.body as {username: unknown; password: unknown};
  if (!isNonEmptyString(username) || !isNonEmptyString(password)) {
    response.status(400).send({status: 'error'});
    return;
  }

  if (!isNonEmptyString(username) || !isNonEmptyString(password)) {
    response.status(400).send({status: 'error'});
    return;
  }

  await authService.register(username, password);
  const result = await authService.login(username, password);
  if (result === null) {
    response.status(500).send({status: 'error'});
  } else {
    response.cookie('personal-gallery_auth', result, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' && request.protocol === 'https',
      sameSite: 'strict',
      expires: new Date(new Date().setFullYear(new Date().getFullYear() + 3)),
    });
    response.status(200).json({status: 'success'});
  }
});

loginRouter.post('/logout', async (request, response) => {
  const token = request.cookies['personal-gallery_auth'] as unknown;
  if (isNonEmptyString(token)) {
    void authService.logout(token);
  }

  response.cookie('personal-gallery_auth', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' && request.protocol === 'https',
    sameSite: 'strict',
    expires: new Date(0),
  });
  response.set('Clear-Site-Data', '"cache", "cookies", "storage"');
  response.status(200).json({status: 'success'});
});

export default loginRouter;
