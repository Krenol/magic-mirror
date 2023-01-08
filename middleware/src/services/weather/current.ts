import { Request, Response } from "express";
import { STD_API_QUERY, WEATHER_API_URL } from "../../config/openmeteo_api";
import { ApiError } from "../../models/api_error";
import { TResponse } from "../../models/fetch";
import { CurrentWeather } from "../../models/weather";
import { getWeatherDescription, getWeatherIconFromWeathercode, sunIsCurrentlyUp } from "./common";

export const buildCurrentWeatherUrl = async (req: Request): Promise<string> => {
    const today_date = new Date().toISOString().slice(0, 10);
    const sunstate_qry = `start_date=${today_date}&end_date=${today_date}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,sunrise,sunset&hourly=apparent_temperature`
    return `${WEATHER_API_URL}/forecast/?latitude=${req.query.latitude}&longitude=${req.query.longitude}&CurrentWeather=true&${STD_API_QUERY}&${sunstate_qry}`;
}

export const handleCurrentWeatherResponse = async (res: Response, response: TResponse): Promise<any> => {
    if (response.status === 200) {
        return createResponse(res, response.body);
    } else if (response.status === 400) {
        throw new ApiError(response.body.reason || 'Error while calling weather API', new Error(), 400);
    } else {
        throw new ApiError("Error while retrieving the current weather", new Error(), 500);
    }
}

const createResponse = async (res: Response, response: any): Promise<Response> => {
    return res.json(await createResponseJson(response)).status(200)
}

const createResponseJson = async (response: any): Promise<CurrentWeather> => {
    const isDay = await sunIsCurrentlyUp(response.daily.sunrise[0], response.daily.sunset[0]);
    const hourlyIndex = parseInt(response.CurrentWeather.time.split("T")[1].split(":")[0]);
    return {
        latitude: response.latitude,
        longitude: response.longitude,
        temperature: {
            current: response.CurrentWeather.temperature,
            min: response.daily.temperature_2m_min[0],
            max: response.daily.temperature_2m_max[0],
            feels_like: response.hourly.apparent_temperature[hourlyIndex],
        },
        precipitation_sum: response.daily.precipitation_sum[0],
        windspeed: response.CurrentWeather.windspeed,
        weathercode: response.CurrentWeather.weathercode,
        update_time: response.CurrentWeather.time,
        weather_icon: await getWeatherIconFromWeathercode(isDay, response.CurrentWeather.weathercode),
        description: await getWeatherDescription(response.CurrentWeather.weathercode)
    }
}