import winston from "winston"
import expressWinston from "express-winston"

export const EXPRESS_ERROR_LOGGER = expressWinston.errorLogger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    )
})

const logConfiguration = {
    'transports': [
        new winston.transports.Console()
    ]
};

export const LOG_LEVELS = { ERROR: 'error', WARN: 'warn', INFO: 'info', DEBUG: 'debug' }

export const LOGGER = winston.createLogger(logConfiguration); 