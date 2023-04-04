import { NextFunction, Request, Response } from "express";
import { ApiError } from "../models/api_error";
import { requestQueryContainsParam } from "../services/misc";
import { isIso8601DatetimeString, isDate } from "../services/dateParser";

const ERROR_MSG = "query parameter is not a valid ISO8601 string!";

export const eventDateTimeMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (await requestQueryContainsParam(req, 'startDate')) {
        return checkDateQueryParam(req, res, next);
    } else {
        return checkNonDateQueryParams(req, res, next);
    }
}

const checkDateQueryParam = async (req: Request, res: Response, next: NextFunction) => {
    if (await requestQueryContainsParam(req, 'minTime') || await requestQueryContainsParam(req, 'maxTime')) {
        next(new ApiError(`'minTime' and 'maxTime' are not compatible with query param 'startDate'!`, new Error(ERROR_MSG), 400));
    }
    if (await !isDate(req.query.startDate!.toString())) {
        next(new ApiError(`'startDate' format is invalid!`, new Error(ERROR_MSG), 400));
    }
    next();
}

const checkNonDateQueryParams = async (req: Request, res: Response, next: NextFunction) => {
    if (await !isValidISOQueryParam(req, 'minTime')) {
        next(new ApiError(`'minTime' ${ERROR_MSG}`, new Error(ERROR_MSG), 400));
    }
    if (await !isValidISOQueryParam(req, 'maxTime')) {
        next(new ApiError(`'maxTime' ${ERROR_MSG}`, new Error(ERROR_MSG), 400));
    }
    next();
}

const isValidISOQueryParam = async (req: Request, paramName: string): Promise<boolean> => {
    return await requestQueryContainsParam(req, paramName) && isIso8601DatetimeString(req.query[paramName]?.toString() || "")
}