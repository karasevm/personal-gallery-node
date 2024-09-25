import {Router} from 'express';
import * as authService from '../services/authService.js';
import {isNonEmptyString} from '../utils/misc.js';
import {validatePassword} from '../utils/authorization.js';

const userRouter = Router();

userRouter.post('/getApiKey', async (_, response) => {
  const token = await authService.generateToken();
  response.json({token});
});

userRouter.post('/updateCredentials', async (request, response) => {
  const {username, password, oldPassword} = request.body as {
    username: unknown;
    password: unknown;
    oldPassword: unknown;
  };

  if (
    (username !== undefined && !isNonEmptyString(username))
    || (password !== undefined && !isNonEmptyString(password))
  ) {
    response.status(400).send({status: 'error'});
    return;
  }

  if (
    !isNonEmptyString(oldPassword)
    || !(await validatePassword(oldPassword))
  ) {
    response.status(401).send({status: 'error'});
    return;
  }

  if (username !== undefined) {
    await authService.updateUsername(username);
  }

  if (password !== undefined) {
    await authService.updatePassword(password);
  }

  await authService.clearSessions();
  response.json({status: 'success'});
});

export default userRouter;
