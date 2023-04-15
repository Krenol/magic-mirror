import { NextFunction, Request, Response } from "express";
import { ApiError } from "models/api/api_error";
import { LOGGER } from "services/loggers";

export const checkAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    LOGGER.info("Check if request is authenticated");
    LOGGER.warn(JSON.stringify(req.session.cookie));
    if (req.isAuthenticated()) {
        LOGGER.info("Authenticated request - continuing");
        req.session.touch();
        return next();
    }
    LOGGER.warn(JSON.stringify(req.user));
    LOGGER.error("Unauthenticated request - throwing error");
    return next(new ApiError("User not authenticated", new Error("User not authenticated"), 401));
}
