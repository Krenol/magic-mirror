import winston from "winston"
import expressWinston from "express-winston"
import LokiTransport from "winston-loki"

const lokiTransporter = new LokiTransport({
    host: "http://loki:3100",
})

export const EXPRESS_ERROR_LOGGER = expressWinston.errorLogger({
    transports: [
        lokiTransporter
    ]
})

const logConfiguration = {
    'transports': [
        lokiTransporter
    ],
};

export const LOG_LEVELS = { ERROR: 'error', WARN: 'warn', INFO: 'info', DEBUG: 'debug' }

export const LOGGER = winston.createLogger(logConfiguration);

export const EXPRESS_LOGGER = expressWinston.logger({
    transports: [
        lokiTransporter
    ],
    headerBlacklist: ['Cookie', 'cookie'],
    meta: true,
    msg: "HTTP {{req.method}} {{req.url}}",
    expressFormat: true,
    colorize: true
})