import { Router } from 'express';
import * as authService from '../services/authService';
import { isNonEmptyString } from '../utils/misc';
import { validatePassword } from '../utils/authorization';

const userRouter = Router();

userRouter.post('/getApiKey', async (req, res) => {
  const token = await authService.generateToken();
  res.json({ token });
});

userRouter.post('/updateCredentials', async (req, res) => {
  const { username, password, oldPassword } = req.body;
  if (
    (typeof username !== 'undefined' && !isNonEmptyString(username))
    || (typeof password !== 'undefined' && !isNonEmptyString(password))
  ) {
    res.status(400).send({ status: 'error' });
    return;
  }
  if (
    !isNonEmptyString(oldPassword)
    || !(await validatePassword(oldPassword))
  ) {
    res.status(401).send({ status: 'error' });
    return;
  }
  if (typeof username !== 'undefined') {
    await authService.updateUsername(username);
  }
  if (typeof password !== 'undefined') {
    await authService.updatePassword(password);
  }
  await authService.clearSessions();
  res.json({ status: 'success' });
});

export default userRouter;
