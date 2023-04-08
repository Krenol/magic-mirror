import { NextFunction, Request, Response } from "express";
import { ApiError } from "models/api/api_error";
import { requestQueryContainsParam } from "services/misc";
import { LOGGER } from "services/loggers";

const ERROR_MSG = "'latitude' and/or 'longitude' query parameters are missing in request!";
const GPS_COORD_REGEX = RegExp('^\\d{1,3}.\\d+$')


export const locationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    LOGGER.info(`Checking for weather GPS location parameters`);
    if (await hasLocationParameters(req) && await hasValidGPSCoordinates(req)) {
        LOGGER.info(`Valid weather GPS location parameters - continuing`);
        return next();
    }
    LOGGER.error(`Invalid or no weather GPS location parameters available-raising error`);
    return next(new ApiError(ERROR_MSG, new Error(ERROR_MSG), 400));
}

export const hasLocationParameters = async (req: Request): Promise<boolean> => {
    return await requestQueryContainsParam(req, 'latitude') && await requestQueryContainsParam(req, 'longitude');
}

export const hasValidGPSCoordinates = async (req: Request): Promise<boolean> => {
    return await isGPSCoordinate(req.query?.latitude?.toString()) && await isGPSCoordinate(req.query?.longitude?.toString())
}

const isGPSCoordinate = async (gpsCoord?: string): Promise<boolean> => {
    return GPS_COORD_REGEX.test(gpsCoord || "");
}