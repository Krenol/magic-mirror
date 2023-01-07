import { Request, Response } from "express";
import { buildCurrentWeatherUrl, handleCurrentWeatherResponse } from "../../services/weather/current";
import { createApiError } from "../../services/error_message";
import { fetchJson } from "../../services/fetch";

export const getCurrentWeather = async (req: Request, res: Response): Promise<Response> => {
    return buildCurrentWeatherUrl(req)
        .then(url => fetchJson(url))
        .then(response => handleCurrentWeatherResponse(res, response))
        .catch(() => createApiError(res, "Error while retrieving the current weather", 500));
}
