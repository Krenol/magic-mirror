import { NextFunction, Request, Response } from "express";
import { ApiError } from "../models/api_error";
import { isIso8601DatetimeString, requestQueryContainsParam } from "../services/misc";

const ERROR_MSG = "query parameter is not a valid ISO8601 string!";

export const eventDateTimeMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (await isValidISOQueryParam(req, 'startTime')) {
        next(new ApiError(`'startTime' ${ERROR_MSG}`, new Error(ERROR_MSG), 400));
    }
    if (await isValidISOQueryParam(req, 'endTime')) {
        next(new ApiError(`'endTime' ${ERROR_MSG}`, new Error(ERROR_MSG), 400));
    }
    next();
}

const isValidISOQueryParam = async (req: Request, paramName: string): Promise<boolean> => {
    return await requestQueryContainsParam(req, paramName) && isIso8601DatetimeString(req.query[paramName]?.toString() || "")
}