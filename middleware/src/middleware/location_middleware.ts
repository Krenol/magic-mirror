import { NextFunction, Request, Response } from "express";
import { ApiError } from "../models/api_error";

const ERROR_MSG = "'latitude' and/or 'longitude' query parameters are missing in request!";

export const locationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (await hasLocationParameters(req.query)) {
        next();
    } else {
        next(new ApiError(ERROR_MSG, new Error(ERROR_MSG), 400));
    }
}

export const hasLocationParameters = async (query: object): Promise<boolean> => {
    return 'latitude' in query && 'longitude' in query;
}
