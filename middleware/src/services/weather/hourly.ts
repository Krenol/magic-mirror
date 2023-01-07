import { Request, Response } from "express";
import { MAX_HOURLY_FORECAST_HOURS, STD_API_QUERY, WEATHER_API_URL } from "../../config/openmeteo_api";
import { createApiError } from "../error_message";
import { TResponse } from "../../models/fetch";
import { forecast_hourly, weather_hourly } from "../../models/weather";
import { exceedsMaxForecastTime, getWeatherDescription, getWeatherIconFromWeathercode, timeHasPassed, timeIsDuringDay } from "./common";

export const buildHourlyWeatherUrl = async (req: Request): Promise<string> => {
    const date = new Date();
    const tmrw_date = new Date();
    tmrw_date.setDate(date.getDate() + 1);
    const today_date_str = date.toISOString().slice(0, 10);
    const tmrw_date_str = tmrw_date.toISOString().slice(0, 10);
    const sunstate_qry = `start_date=${today_date_str}&end_date=${tmrw_date_str}&daily=sunrise,sunset&hourly=temperature_2m,windspeed_10m,precipitation,weathercode`
    return `${WEATHER_API_URL}/forecast/?latitude=${req.query.latitude}&longitude=${req.query.longitude}&current_weather=true&${STD_API_QUERY}&${sunstate_qry}`;
}

export const handleHourlyWeatherResponse = async (res: Response, response: TResponse, forecast_hours: number = MAX_HOURLY_FORECAST_HOURS): Promise<any> => {
    if (response.status === 200) {
        return createResponse(res, response.body, forecast_hours);
    } else if (response.status === 400) {
        return createApiError(res, response.body.reason || 'Error while calling weather API', 400);
    } else {
        return createApiError(res, "Error while retrieving the current weather", 500);
    }
}

export const getForecastHours = async (req: Request): Promise<number> => {
    const hour_query_param = parseInt((req.query.hours || MAX_HOURLY_FORECAST_HOURS).toString());
    return hour_query_param
}

const createResponse = async (res: Response, response: any, forecast_hours: number): Promise<Response> => {
    return res.json(await createResponseJson(response, forecast_hours)).status(200)
}

const createResponseJson = async (response: any, forecast_hours: number): Promise<weather_hourly> => {
    return {
        latitude: response.latitude,
        longitude: response.longitude,
        timezone: response.timezone,
        forecast: await createForecastArray(response, forecast_hours)
    }
}

const createForecastArray = async (response: any, forecast_hours: number): Promise<Array<forecast_hourly>> => {
    const forecast: Array<Promise<forecast_hourly>> = [];
    const count = response.hourly.time.length;
    for (let i = 0; i < count; i++) {
        if (await isValidHourlyForecastTime(response.hourly.time[i], forecast_hours)) {
            forecast.push(createForecastHour(response, i));
        }
    }
    return Promise.all(forecast);
}

const isValidHourlyForecastTime = async (time: string, forecast_hours: number): Promise<boolean> => {
    return await timeHasPassed(time) === false && await exceedsMaxForecastTime(time, forecast_hours) === false;
}

const createForecastHour = async (response: any, index: number): Promise<forecast_hourly> => {
    const weathercode = response.hourly.weathercode[index];
    const time = response.hourly.time[index];
    const sunIsUp = await timeIsDuringDay(time, response.daily.sunrise[0], response.daily.sunset[0]);
    return {
        time: time,
        temperature: response.hourly.temperature_2m[index],
        precipitation: response.hourly.precipitation[index],
        weather_icon: await getWeatherIconFromWeathercode(sunIsUp, weathercode),
        windspeed: response.hourly.windspeed_10m[index],
        weathercode: weathercode,
        description: await getWeatherDescription(weathercode)
    }
}