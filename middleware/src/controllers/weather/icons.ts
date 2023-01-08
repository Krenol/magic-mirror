import { Response, Request, NextFunction } from "express";
import { ApiError } from "../../models/api_error";
import { fetchBuffer } from "../../services/fetch";
import { buildWeatherIconUrl, handleWeatherIconResponse } from "../../services/weather/icon";

export const getWeatherIcon = async (req: Request, res: Response, next: NextFunction) => {
    return buildWeatherIconUrl(req)
        .then(url => fetchBuffer(url))
        .then(response => handleWeatherIconResponse(res, response))
        .catch((err: ApiError) => next(err));
}
