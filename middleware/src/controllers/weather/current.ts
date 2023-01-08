import { NextFunction, Request, Response } from "express";
import { buildCurrentWeatherUrl, handleCurrentWeatherResponse } from "../../services/weather/current";
import { fetchJson } from "../../services/fetch";
import { ApiError } from "../../models/api_error";

export const getCurrentWeather = async (req: Request, res: Response, next: NextFunction) => {
    return buildCurrentWeatherUrl(req)
        .then(url => fetchJson(url))
        .then(response => handleCurrentWeatherResponse(res, response))
        .catch((err: ApiError) => next(err));
}
