import { NextFunction, Request, Response } from "express";
import { ApiError } from "models/api/api_error";
import { LOGGER } from "services/loggers";

export const checkAuthenticated = async (
  req: Request,
  _: Response,
  next: NextFunction,
) => {
  LOGGER.info("Check if request is authenticated");
  LOGGER.debug(JSON.stringify(req.session.cookie));
  if (req.isAuthenticated()) {
    LOGGER.info("Authenticated request - continuing");
    req.session.touch();
    next();
  } else {
    LOGGER.error("Unauthenticated request - throwing error");
    next(
      new ApiError(
        "User not authenticated",
        new Error("User not authenticated"),
        401,
      ),
    );
  }
};
