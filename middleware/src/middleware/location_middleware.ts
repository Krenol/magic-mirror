import { NextFunction, Request, Response } from "express";
import { ApiError } from "../models/api_error";
import { requestQueryContainsParam } from "../services/misc";

const ERROR_MSG = "'latitude' and/or 'longitude' query parameters are missing in request!";
const GPS_COORD_REGEX = RegExp('^\\d{1,3}.\\d+$')


export const locationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (await hasLocationParameters(req) && await hasValidGPSCoordinates(req)) {
        next();
    } else {
        next(new ApiError(ERROR_MSG, new Error(ERROR_MSG), 400));
    }
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