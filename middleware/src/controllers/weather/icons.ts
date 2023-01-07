import { Response, Request } from "express";
import { createApiError } from "../../services/error_message";
import { fetchBuffer } from "../../services/fetch";
import { buildWeatherIconUrl, handleWeatherIconResponse } from "../../services/weather/icon";

export const getWeatherIcon = async (req: Request, res: Response): Promise<Response> => {
    return buildWeatherIconUrl(req)
        .then(url => fetchBuffer(url))
        .then(response => handleWeatherIconResponse(res, response))
        .catch(() => createApiError(res, "Error while retrieving the weather icon", 500));
}
