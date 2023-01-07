import { Request, Response } from "express";
import { createApiError } from "../../services/error_message";
import { fetchJson } from "../../services/fetch";
import { buildHourlyWeatherUrl, getForecastHours, handleHourlyWeatherResponse } from "../../services/weather/hourly";

export const getHourlyWeather = async (req: Request, res: Response): Promise<Response> => {
    const forecast_hours = await getForecastHours(req);
    return buildHourlyWeatherUrl(req)
        .then(url => fetchJson(url))
        .then(response => handleHourlyWeatherResponse(res, response, forecast_hours))
        .catch(() => createApiError(res, "Error while retrieving the hourly weather forecast", 500));
}
