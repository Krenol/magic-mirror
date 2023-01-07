import { NextFunction, Request, Response } from "express";
import { createApiError } from "../services/error_message";

export const eventCountMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (await hasCountParameter(req.query)) {
        const valid = await validCountParameter(req.query.count as string)
        valid ? next() : createApiError(res, "Invalid 'count' query parameter! Must be between 1 and 100.", 400);
    } else {
        next();
    }
}

const hasCountParameter = async (query: object): Promise<boolean> => {
    return 'count' in query
}

const validCountParameter = async (count: string): Promise<boolean> => {
    return /^[1-9]\d?$|^100$/.test(count);
}
