import { Router } from 'express';
import { isSetupFinished } from '../utils/misc';
import { ACCEPTED_MIME } from '../utils/consts';

const meta = Router();
// Meta route should not expose any sensetive information, as it is used for initial app state.
meta.get('/', async (_, res) => {
  res.json({ accepted: ACCEPTED_MIME, setupFinished: isSetupFinished() });
});

export default meta;
