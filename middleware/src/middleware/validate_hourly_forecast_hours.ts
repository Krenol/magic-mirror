import { MAX_HOURLY_FORECAST_HOURS } from "config/openmeteo_api";
import { NextFunction, Request, Response } from "express";
import { getForecastHours } from "routes/weather/services/hourly";
import { ApiError } from "models/api/api_error";
import { requestQueryContainsParam } from "services/misc";
import { LOGGER } from "services/loggers";

const ERROR_MSG = `query param 'hours' must be greater 0 and smaller ${MAX_HOURLY_FORECAST_HOURS}`

export const validateHourlyForecastHours = async (req: Request, res: Response, next: NextFunction) => {
    LOGGER.info("Checking hours query parameter")
    if (await hasHoursParam(req)) {

        const hour_query_param = await getForecastHours(req);
        const validHourParam = await hasvalidHourParam(hour_query_param);
        return validHourParam ? next() : next(new ApiError(ERROR_MSG, new Error(ERROR_MSG), 400));
    } else {
        return next();
    }
}

const hasHoursParam = async (req: Request): Promise<boolean> => {
    return await requestQueryContainsParam(req, 'hours')
}

const hasvalidHourParam = async (hour_query_param: number): Promise<boolean> => {
    return hour_query_param <= MAX_HOURLY_FORECAST_HOURS && hour_query_param > 0;
}