export const WEATHER_API_URL = 'https://api.open-meteo.com/v1';
export const WEATHER_UNITS = {
    timezone: "GMT%2B0",
    temperature_unit: "celsius",
    windspeed_unit: "kmh",
    precipitation_unit: "mm",
    timeformat: "iso8601"
}
export const STD_API_QUERY = Object.entries(WEATHER_UNITS).join("&").replace(/,/g, "=");
export const WEATHER_ICON_URL = 'https://openweathermap.org'
export const MAX_FORECAST_DAYS = 9;
export const FORECAST_FIELDS = 'temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_hours,weathercode,sunrise,sunset'
export const MAX_HOURLY_FORECAST_HOURS = 24;