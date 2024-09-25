import {Router} from 'express';
import {isSetupFinished} from '../utils/misc.js';
import {ACCEPTED_MIME} from '../utils/consts.js';

const meta = Router();
// Meta route should not expose any sensetive information, as it is used for initial app state.
meta.get('/', async (_, response) => {
  response.json({accepted: ACCEPTED_MIME, setupFinished: isSetupFinished()});
});

export default meta;
