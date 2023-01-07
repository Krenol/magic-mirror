import { unknown_weathercode_entry } from "../../services/weather/defaults";
import { weather_code_list, weather_code_entry } from "../../models/weather";
import { MAX_HOURLY_FORECAST_HOURS } from "../../config/openmeteo_api";

export const getWeatherIconFromWeathercode = async (useDayIcons: boolean, weathercode: number): Promise<string> => {
    const weather_code_entry = await getWeatherCodeEntry(weathercode)
    if (useDayIcons) {
        return weather_code_entry.weather_icon_day;
    } else {
        return weather_code_entry.weather_icon_night;
    }
}

export const getWeatherDescription = async (weathercode: number): Promise<string> => {
    const weather_code_entry = await getWeatherCodeEntry(weathercode);
    return weather_code_entry.description;
}

const getWeatherCodeEntry = async (weathercode: number): Promise<weather_code_entry> => {
    const weather_code_entry = weather_code_list.find(item => item.weathercode == weathercode);
    return weather_code_entry || unknown_weathercode_entry;
}

export const sunIsCurrentlyUp = async (sunrise: string, sunset: string): Promise<boolean> => {
    const now = new Date();
    const sunrise_date = new Date(sunrise);
    const sunset_date = new Date(sunset);
    return dateIsDuringDay(now, sunrise_date, sunset_date);
}

export const dateIsDuringDay = async (time: Date, sunrise: Date, sunset: Date): Promise<boolean> => {
    return time.getTime() > sunrise.getTime() && time.getTime() < sunset.getTime();
}

export const timeIsDuringDay = async (time: string, sunrise: string, sunset: string): Promise<boolean> => {
    const time_date = new Date(time);
    const sunrise_date = new Date(sunrise);
    const sunset_date = new Date(sunset);
    return dateIsDuringDay(time_date, sunrise_date, sunset_date);
}

export const timeHasPassed = async (time: string): Promise<boolean> => {
    const time_date = new Date(time);
    const now = new Date();
    return now.getTime() > time_date.getTime()
}

export const exceedsMaxForecastTime = async (time: string, maxTime: number = MAX_HOURLY_FORECAST_HOURS): Promise<boolean> => {
    const time_date = new Date(time);
    const now = new Date();
    return (time_date.getTime() - now.getTime()) / 3.6e+6 > maxTime;
}