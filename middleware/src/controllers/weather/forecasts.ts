import { Request, Response } from "express";
import { buildtWeatheForecastrUrl, handleWeatherForecastResponse } from "../../services/weather/forecast";
import { createApiError } from "../../services/error_message";
import { fetchJson } from "../../services/fetch";

export const getWeatherForecast = async (req: Request, res: Response): Promise<Response> => {
    return buildtWeatheForecastrUrl(req)
        .then(url => fetchJson(url))
        .then(response => handleWeatherForecastResponse(res, response))
        .catch(() => createApiError(res, "Error while retrieving the weather forecast", 500));
}
