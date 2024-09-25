import process from 'node:process';
import winston from 'winston';

const logger = winston.createLogger();

if (process.env.NODE_ENV === 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.cli(),
    }),
  );
} else {
  logger.add(
    new winston.transports.Console({
      format: winston.format.cli(),
      level: 'silly',
    }),
  );
}

export default logger;
