import { MAX_FORECAST_DAYS } from "config/openmeteo_api";
import { NextFunction, Request, Response } from "express";
import { getForecastDays } from "routes/weather/services/forecast";
import { ApiError } from "models/api/api_error";
import { requestQueryContainsParam } from "services/misc";

const ERROR_MSG = `query param 'days' must be greater 0 and smaller ${MAX_FORECAST_DAYS}`

export const validateWeatherForecastDays = async (req: Request, res: Response, next: NextFunction) => {
    if (await hasDaysParam(req)) {
        const day_query_param = await getForecastDays(req);
        const validDayParam = await hasValidDayParam(day_query_param);
        return validDayParam ? next() : next(new ApiError(ERROR_MSG, new Error(ERROR_MSG), 400));
    } else {
        return next();
    }
}

const hasDaysParam = async (req: Request): Promise<boolean> => {
    return await requestQueryContainsParam(req, 'days')
}

const hasValidDayParam = async (day_query_param: number): Promise<boolean> => {
    return day_query_param <= MAX_FORECAST_DAYS && day_query_param > 0;
}