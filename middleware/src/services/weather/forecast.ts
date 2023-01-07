import { Request, Response } from "express";
import { FORECAST_FIELDS, MAX_FORECAST_DAYS, STD_API_QUERY, WEATHER_API_URL } from "../../config/openmeteo_api";
import { createApiError } from "../error_message";
import { TResponse } from "../../models/fetch";
import { forecast_day, weather_forecast } from "../../models/weather";
import { getWeatherDescription, getWeatherIconFromWeathercode } from "./common";

export const buildWeatheForecastrUrl = async (req: Request): Promise<string> => {
    const start_date = (await getDateInDays(1)).toISOString().slice(0, 10);
    const end_date = (await getForecastEnddate(req)).toISOString().slice(0, 10);
    const api_qry = `start_date=${start_date}&end_date=${end_date}&daily=${FORECAST_FIELDS}`;
    return `${WEATHER_API_URL}/forecast/?latitude=${req.query.latitude}&longitude=${req.query.longitude}&${STD_API_QUERY}&${api_qry}`;
}

const getForecastEnddate = async (req: Request): Promise<Date> => {
    const forecast_days = await getForecastDays(req);
    return getDateInDays(forecast_days);
}

const getDateInDays = async (days: number): Promise<Date> => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date;
}

export const getForecastDays = async (req: Request): Promise<number> => {
    const day_query_param = parseInt((req.query.days || MAX_FORECAST_DAYS).toString());
    return day_query_param
}

export const handleWeatherForecastResponse = async (res: Response, response: TResponse): Promise<any> => {
    if (response.status === 200) {
        return createResponse(res, response.body);
    } else if (response.status === 400) {
        return createApiError(res, response.body.reason || 'Error while calling weather forecast API', 400);
    } else {
        return createApiError(res, "Error while retrieving the weather forecast", 500);
    }
}

const createResponse = async (res: Response, response: any): Promise<Response> => {
    return res.json(await createResponseJson(response)).status(200);
}

const createResponseJson = async (response: any): Promise<weather_forecast> => {
    return {
        latitude: response.latitude,
        longitude: response.longitude,
        timezone: response.timezone,
        days: response.daily.time.length,
        forecast: await createForecastArray(response)
    }
}

const createForecastArray = async (response: any): Promise<Array<forecast_day>> => {
    const forecast: Array<Promise<forecast_day>> = [];
    const count = response.daily.time.length;
    for (let i = 0; i < count; i++) {
        forecast.push(createForecastDay(response, i));
    }
    return Promise.all(forecast);
}

const createForecastDay = async (response: any, index: number): Promise<forecast_day> => {
    const weathercode = response.daily.weathercode[index];
    return {
        date: response.daily.time[index],
        temperature: {
            min: response.daily.temperature_2m_min[index],
            max: response.daily.temperature_2m_max[index],
            unit: response.daily_units.temperature_2m_max
        },
        precipitation: {
            amount: response.daily.precipitation_sum[index],
            hours: response.daily.precipitation_hours[index],
            amount_unit: response.daily_units.precipitation_sum
        },
        weather_icon: await getWeatherIconFromWeathercode(true, weathercode),
        sunrise: response.daily.sunrise[index],
        sunset: response.daily.sunset[index],
        weathercode: weathercode,
        description: await getWeatherDescription(weathercode)
    }
}