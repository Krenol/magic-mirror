import { NextFunction, Request, Response } from "express";
import { ApiError } from "models/api/api_error";
import { requestQueryContainsParam } from "services/misc";
import { isIso8601DatetimeString, isDate } from "services/dateParser"
import { LOGGER } from "services/loggers";

const ERROR_MSG = "query parameter is not a valid ISO8601 string!";

export const eventDateTimeMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    LOGGER.info("Checking event date query parameters");
    if (await requestQueryContainsParam(req, 'startDate')) {
        LOGGER.info(`request contains startDate - handling via startDate logic`);
        return checkDateQueryParam(req, res, next);
    } else {
        LOGGER.info(`request contains no startDate - checking for minTime and maxTime params`);
        return checkNonDateQueryParams(req, res, next);
    }
}

const checkDateQueryParam = async (req: Request, res: Response, next: NextFunction) => {
    if (await requestQueryContainsParam(req, 'minTime') || await requestQueryContainsParam(req, 'maxTime')) {
        LOGGER.error(`request contains minTime ${req.query.minTime} or maxTime ${req.query.maxTime} query params - raising error`);
        return next(new ApiError(`'minTime' and 'maxTime' are not compatible with query param 'startDate'!`, new Error(ERROR_MSG), 400));
    }
    if (await !isDate(req.query.startDate!.toString())) {
        LOGGER.error(`request contains invalid startDate ${req.query.startDate}`);
        return next(new ApiError(`'startDate' format is invalid!`, new Error(ERROR_MSG), 400));
    }
    LOGGER.info(`request contains valid startDate ${req.query.startDate} - continuing`);
    return next();
}

const checkNonDateQueryParams = async (req: Request, res: Response, next: NextFunction) => {
    if (await !isValidISOQueryParam(req, 'minTime')) {
        LOGGER.error(`Invalid minTime query param ${req.query.minTime} - raising error`);
        return next(new ApiError(`'minTime' ${ERROR_MSG}`, new Error(ERROR_MSG), 400));
    }
    if (await !isValidISOQueryParam(req, 'maxTime')) {
        LOGGER.error(`Invalid maxTime query param ${req.query.maxTime} - raising error`);
        return next(new ApiError(`'maxTime' ${ERROR_MSG}`, new Error(ERROR_MSG), 400));
    }
    return next();
}

const isValidISOQueryParam = async (req: Request, paramName: string): Promise<boolean> => {
    return await requestQueryContainsParam(req, paramName) && isIso8601DatetimeString(req.query[paramName]?.toString() || "")
}