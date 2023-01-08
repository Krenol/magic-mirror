import { CurrentWeatherResource } from "../../models/current_weather";
import { Weather } from "../../models/weather";

export const parseWeatherJson = async (data: CurrentWeatherResource): Promise<Weather> => {
    let weather: Weather = {};
    weather.currentTemp = Math.round(data.temperature.current);
    weather.iconCode = data.weather_icon;
    weather.todayMinTemp = Math.round(data.temperature.min);
    weather.todayMaxTemp = Math.round(data.temperature.max);
    weather.feelsLike = Math.round(data.temperature.feels_like);
    weather.precipitation = Math.round(data.precipitation_sum * 10) / 10;
    return weather;
}