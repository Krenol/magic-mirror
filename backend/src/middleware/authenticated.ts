import { NextFunction, Request, Response } from "express";
import { ApiError } from "models/api/api_error";
import { LOGGER } from "services/loggers";

export const checkAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    LOGGER.info("Check if request is authenticated");
    if (req.isAuthenticated()) {
        LOGGER.info("Authenticated request - continuing");
        return next();
    }
    LOGGER.error("Unauthenticated request - throwing error");
    return next(new ApiError("User not authenticated", new Error("User not authenticated"), 401));
}