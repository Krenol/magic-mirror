import { Weather } from "../../models/weather";

export const parseWeatherJson = async (data: any): Promise<Weather> => {
    let weather: Weather = {};
    weather.currentTemp = data.temperature?.current ? Math.round(data.temperature.current) : undefined;
    weather.iconCode = data.weather_icon || undefined;
    weather.todayMinTemp = data.temperature?.min ? Math.round(data.temperature.min) : undefined;
    weather.todayMaxTemp = data.temperature?.max ? Math.round(data.temperature.max) : undefined;
    weather.feelsLike = data.temperature?.feels_like ? Math.round(data.temperature.feels_like) : undefined;
    weather.precipitation = data.precipitation_sum ? Math.round(data.precipitation_sum * 10) / 10 : undefined;
    return weather;
}