import { weather_code_list, WeatherCodeEntry } from 'models/api/weather';
import { MAX_HOURLY_FORECAST_HOURS } from 'config';

export const getWeatherIconFromWeathercode = async (useDayIcons: boolean, weathercode: number): Promise<string> => {
  const WeatherCodeEntry = await getWeatherCodeEntry(weathercode);
  if (useDayIcons) {
    return WeatherCodeEntry.weather_icon_day;
  } else {
    return WeatherCodeEntry.weather_icon_night;
  }
};

export const getWeatherDescription = async (weathercode: number): Promise<string> => {
  const WeatherCodeEntry = await getWeatherCodeEntry(weathercode);
  return WeatherCodeEntry.description;
};

const getWeatherCodeEntry = async (weathercode: number): Promise<WeatherCodeEntry> => {
  const WeatherCodeEntry = weather_code_list.find((item) => item.weathercode == weathercode);
  return WeatherCodeEntry ?? unknown_weathercode_entry;
};

const unknown_weathercode_entry: WeatherCodeEntry = {
  weathercode: -1,
  description: 'Unknown weather',
  weather_icon_day: '00d',
  weather_icon_night: '00n',
};

export const sunIsCurrentlyUp = async (sunrise: string, sunset: string): Promise<boolean> => {
  const now = new Date();
  const sunrise_date = new Date(sunrise);
  const sunset_date = new Date(sunset);
  return dateIsDuringDay(now, sunrise_date, sunset_date);
};

export const dateIsDuringDay = async (time: Date, sunrise: Date, sunset: Date): Promise<boolean> => {
  return time.getTime() > sunrise.getTime() && time.getTime() < sunset.getTime();
};

export const timeIsDuringDay = async (time: string, sunrise: string, sunset: string): Promise<boolean> => {
  const time_date = new Date(time);
  const sunrise_date = new Date(sunrise);
  const sunset_date = new Date(sunset);
  return dateIsDuringDay(time_date, sunrise_date, sunset_date);
};

export const timeHasPassed = async (time: string): Promise<boolean> => {
  const time_date = new Date(time);
  const now = new Date();
  return now.getTime() > time_date.getTime();
};

export const exceedsMaxForecastTime = async (
  time: string,
  maxTime: number = MAX_HOURLY_FORECAST_HOURS,
): Promise<boolean> => {
  const time_date = new Date(time);
  const now = new Date();
  return (time_date.getTime() - now.getTime()) / 3.6e6 > maxTime;
};
