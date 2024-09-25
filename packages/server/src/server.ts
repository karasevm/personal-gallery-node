import http from 'node:http';
import app from './app.js';
import * as config from './utils/config.js';
import logger from './utils/logger.js';

const server = http.createServer(app);

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
