import { createApiError } from "../services/error_message";
import { NextFunction, Request, Response } from "express";

export const locationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (await hasLocationParameters(req.query)) {
        next();
    } else {
        createApiError(res, "'latitude' and/or 'longitude' query parameters are missing in request!", 400);
    }
}

export const hasLocationParameters = async (query: object): Promise<boolean> => {
    return 'latitude' in query && 'longitude' in query;
}
