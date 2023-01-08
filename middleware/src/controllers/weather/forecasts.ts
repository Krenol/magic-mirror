import { NextFunction, Request, Response } from "express";
import { buildWeatheForecastrUrl, handleWeatherForecastResponse } from "../../services/weather/forecast";
import { fetchJson } from "../../services/fetch";
import { ApiError } from "../../models/api_error";

export const getWeatherForecast = async (req: Request, res: Response, next: NextFunction) => {
    return buildWeatheForecastrUrl(req)
        .then(url => fetchJson(url))
        .then(response => handleWeatherForecastResponse(res, response))
        .catch((err: ApiError) => next(err));
}
