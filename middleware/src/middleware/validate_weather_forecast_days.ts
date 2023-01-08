import { MAX_FORECAST_DAYS } from "../config/openmeteo_api";
import { NextFunction, Request, Response } from "express";
import { getForecastDays } from "../services/weather/forecast";
import { ApiError } from "../models/api_error";

const ERROR_MSG = `query param 'days' must be greater 0 and smaller ${MAX_FORECAST_DAYS}`

export const validateWeatherForecastDays = async (req: Request, res: Response, next: NextFunction) => {
    if (await hasDaysParam(req.query)) {
        const day_query_param = await getForecastDays(req);
        const validDayParam = await hasValidDayParam(day_query_param);
        validDayParam ? next() : next(new ApiError(ERROR_MSG, new Error(ERROR_MSG), 400));
    } else {
        next();
    }
}

const hasDaysParam = async (query: object): Promise<boolean> => {
    return 'days' in query
}

const hasValidDayParam = async (day_query_param: number): Promise<boolean> => {
    return day_query_param <= MAX_FORECAST_DAYS && day_query_param > 0;
}