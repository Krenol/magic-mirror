import { NextFunction, Request, Response } from "express";
import { ApiError } from "../models/api_error";
import { requestQueryContainsParam } from "../services/misc";

const ERROR_MSG = "Invalid 'count' query parameter! Must be between 1 and 100.";

export const eventCountMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (await hasCountParameter(req)) {
        const valid = await validCountParameter(req.query.count as string)
        valid ? next() : next(new ApiError(ERROR_MSG, new Error(ERROR_MSG), 400));
    } else {
        next();
    }
}

const hasCountParameter = async (req: Request): Promise<boolean> => {
    return await requestQueryContainsParam(req, 'count')
}

const validCountParameter = async (count: string): Promise<boolean> => {
    return /^[1-9]\d?$|^100$/.test(count);
}
