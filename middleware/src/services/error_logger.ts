import winston from "winston"
import expressWinston from "express-winston"

export const error_logger = expressWinston.errorLogger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    )
})