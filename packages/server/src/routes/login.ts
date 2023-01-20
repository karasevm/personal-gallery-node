import { Router } from 'express';
import * as authService from '../services/authService';
import { isSetupFinished, isNonEmptyString } from '../utils/misc';

const loginRouter = Router();

loginRouter.post('/', async (req, res) => {
  if (!isSetupFinished()) {
    res.status(500).json({ status: 'error' });
    return;
  }
  const { username, password } = req.body;
  const result = await authService.login(username, password);
  if (result !== null) {
    res.cookie('personal-gallery_auth', result, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(new Date().setFullYear(new Date().getFullYear() + 3)),
    });
    res.status(200).json({ status: 'success' });
  } else {
    res.status(401).send({ status: 'error' });
  }
});

loginRouter.post('/register', async (req, res) => {
  if (isSetupFinished()) {
    res.status(403).json({ status: 'already_registered' });
    return;
  }
  const { username, password } = req.body;
  if (!isNonEmptyString(username) || !isNonEmptyString(password)) {
    res.status(400).send({ status: 'error' });
    return;
  }
  await authService.register(username, password);
  const result = await authService.login(username, password);
  if (result !== null) {
    res.cookie('personal-gallery_auth', result, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' && req.protocol === 'https',
      sameSite: 'strict',
      expires: new Date(new Date().setFullYear(new Date().getFullYear() + 3)),
    });
    res.status(200).json({ status: 'success' });
  } else {
    res.status(500).send({ status: 'error' });
  }
});

loginRouter.post('/logout', async (req, res) => {
  authService.logout(req.cookies['personal-gallery_auth']);
  res.cookie('personal-gallery_auth', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' && req.protocol === 'https',
    sameSite: 'strict',
    expires: new Date(0),
  });
  res.set('Clear-Site-Data', '"cache", "cookies", "storage"');
  res.status(200).json({ status: 'success' });
});

export default loginRouter;
