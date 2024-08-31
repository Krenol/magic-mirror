import winston from 'winston';
import expressWinston from 'express-winston';
import LokiTransport from 'winston-loki';
import os from 'os';

// const LOKI_TRANSPORTER = new LokiTransport({
//   host: 'http://loki:3100',
// });

const CONSOLE = new winston.transports.Console();

const LOG_META = {
  service: 'express-backend',
  hostname: os.hostname(),
};
const LOG_FORMAT = winston.format.json();

const DEFAULT_LOG_CONFIG = {
  baseMeta: LOG_META,
  format: LOG_FORMAT,
  transports: [CONSOLE],
};

export const EXPRESS_ERROR_LOGGER = expressWinston.errorLogger({
  ...DEFAULT_LOG_CONFIG,
  headerBlacklist: ['Cookie', 'cookie'],
});

export const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
};

export const LOGGER = winston.createLogger({
  defaultMeta: LOG_META,
  format: LOG_FORMAT,
  transports: [CONSOLE],
});

export const EXPRESS_LOGGER = expressWinston.logger({
  ...DEFAULT_LOG_CONFIG,
  headerBlacklist: ['Cookie', 'cookie'],
  meta: false,
  expressFormat: true,
});
