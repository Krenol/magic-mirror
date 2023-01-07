import { Response, Request } from "express";
import { OPENWEATHER_URL } from "../../config/icon_api";
import { createApiError } from "../error_message";
import { TResponse } from "../../models/fetch";

export const buildWeatherIconUrl = async (req: Request): Promise<string> => {
    return `${OPENWEATHER_URL}/img/wn/${req.params.weatherCode}.png`
}

export const handleWeatherIconResponse = async (res: Response, response: TResponse): Promise<any> => {
    if (response.status === 200) {
        return createIconResponse(res, response.body);
    } else if (response.status === 404) {
        return createApiError(res, 'Icon not found!', 404);
    } else {
        return createApiError(res, "Error while retrieving the weather icon", 500);
    }
}

const createIconResponse = async (res: Response, response: any): Promise<Response> => {
    res.header({ 'Content-Type': 'image/png' }).write(Buffer.from(response));
    return res.end()
}
