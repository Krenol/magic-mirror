import { Request, Response } from "express";
import { STD_API_QUERY, WEATHER_API_URL } from "../../config/openmeteo_api";
import { createApiError } from "../error_message";
import { TResponse } from "../../models/fetch";
import { current_weather } from "../../models/weather";
import { getWeatherDescription, getWeatherIconFromWeathercode, sunIsCurrentlyUp } from "./common";

export const buildCurrentWeatherUrl = async (req: Request): Promise<string> => {
    const today_date = new Date().toISOString().slice(0, 10);
    const sunstate_qry = `start_date=${today_date}&end_date=${today_date}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,sunrise,sunset&hourly=apparent_temperature`
    return `${WEATHER_API_URL}/forecast/?latitude=${req.query.latitude}&longitude=${req.query.longitude}&current_weather=true&${STD_API_QUERY}&${sunstate_qry}`;
}

export const handleCurrentWeatherResponse = async (res: Response, response: TResponse): Promise<any> => {
    if (response.status === 200) {
        return createResponse(res, response.body);
    } else if (response.status === 400) {
        return createApiError(res, response.body.reason || 'Error while calling weather API', 400);
    } else {
        return createApiError(res, "Error while retrieving the current weather", 500);
    }
}

const createResponse = async (res: Response, response: any): Promise<Response> => {
    return res.json(await createResponseJson(response)).status(200)
}

const createResponseJson = async (response: any): Promise<current_weather> => {
    const isDay = await sunIsCurrentlyUp(response.daily.sunrise[0], response.daily.sunset[0]);
    const hourlyIndex = parseInt(response.current_weather.time.split("T")[1].split(":")[0]);
    return {
        latitude: response.latitude,
        longitude: response.longitude,
        temperature: {
            current: response.current_weather.temperature,
            min: response.daily.temperature_2m_min[0],
            max: response.daily.temperature_2m_max[0],
            feels_like: response.hourly.apparent_temperature[hourlyIndex],
        },
        precipitation_sum: response.daily.precipitation_sum[0],
        windspeed: response.current_weather.windspeed,
        weathercode: response.current_weather.weathercode,
        update_time: response.current_weather.time,
        weather_icon: await getWeatherIconFromWeathercode(isDay, response.current_weather.weathercode),
        description: await getWeatherDescription(response.current_weather.weathercode)
    }
}