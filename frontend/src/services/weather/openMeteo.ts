import { DateTime } from 'luxon'
import { externalFetchJson } from '../../common/externalFetch'
import { CurrentWeatherResource } from '../../models/current_weather'
import {
    DailyWeatherObject,
    WeatherForecastResource,
} from '../../models/daily_forecast'
import {
    HourlyWeatherObject,
    HourlyWeatherResource,
} from '../../models/hourly_forecast'
import {
    dateIsDuringDay,
    exceedsMaxForecastTime,
    timeHasPassed,
    timeIsDuringDay,
} from './daynight'
import {
    getWeatherDescription,
    getWeatherIconFromWeathercode,
} from './weatherCodes'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Json = Record<string, any>

export const WEATHER_API_URL = 'https://api.open-meteo.com/v1'

// Note: Open-Meteo's own defaults already match celsius/kmh/mm/iso8601, so no
// explicit unit params are sent here (matching the backend's actual, if
// accidental, behavior).

const dateOnly = (date: Date): string => date.toISOString().slice(0, 10)

const getDateInDays = (days: number): Date => {
    const date = new Date()
    date.setDate(date.getDate() + days)
    return date
}

const buildCurrentWeatherUrl = (
    latitude: number,
    longitude: number,
    timeZone: string
): string => {
    const today = dateOnly(new Date())
    const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        current_weather: 'true',
        start_date: today,
        end_date: today,
        daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,sunrise,sunset',
        timezone: timeZone ?? 'GMT',
        hourly: 'apparent_temperature',
    })
    return `${WEATHER_API_URL}/forecast/?${params.toString()}`
}

export const getCurrentWeather = async (
    latitude: number,
    longitude: number,
    timeZone: string
): Promise<CurrentWeatherResource> => {
    const response = await externalFetchJson<Json>(
        buildCurrentWeatherUrl(latitude, longitude, timeZone)
    )
    const isDay = dateIsDuringDay(
        new Date(),
        new Date(response.daily.sunrise[0]),
        new Date(response.daily.sunset[0])
    )
    const hourlyIndex = parseInt(
        response.current_weather.time.split('T')[1].split(':')[0]
    )
    return {
        latitude: response.latitude,
        longitude: response.longitude,
        temperature: {
            current: response.current_weather.temperature,
            min: response.daily.temperature_2m_min[0],
            max: response.daily.temperature_2m_max[0],
            feels_like: response.hourly.apparent_temperature[hourlyIndex],
            unit: response.current_weather_units.temperature,
        },
        precipitation: {
            value: response.daily.precipitation_sum[0],
            unit: response.daily_units.precipitation_sum,
        },
        windspeed: {
            value: response.current_weather.windspeed,
            unit: response.current_weather_units.windspeed,
        },
        weathercode: response.current_weather.weathercode,
        update_time: response.current_weather.time,
        weather_icon: getWeatherIconFromWeathercode(
            isDay,
            response.current_weather.weathercode
        ),
        description: getWeatherDescription(
            response.current_weather.weathercode
        ),
    }
}

const buildWeatherForecastUrl = (
    latitude: number,
    longitude: number,
    forecastDays: number,
    timeZone: string
): string => {
    const startDate = dateOnly(getDateInDays(1))
    const endDate = dateOnly(getDateInDays(forecastDays))
    const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        start_date: startDate,
        end_date: endDate,
        daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_hours,weathercode,sunrise,sunset,wind_speed_10m_max',
        timezone: timeZone ?? 'GMT',
    })
    return `${WEATHER_API_URL}/forecast/?${params.toString()}`
}

const createForecastDay = (
    response: Json,
    index: number
): WeatherForecastResource => {
    const weathercode = response.daily.weathercode[index]
    return {
        date: response.daily.time[index],
        temperature: {
            min: response.daily.temperature_2m_min[index],
            max: response.daily.temperature_2m_max[index],
            unit: response.daily_units.temperature_2m_max,
        },
        precipitation: {
            amount: response.daily.precipitation_sum[index],
            hours: response.daily.precipitation_hours[index],
            amount_unit: response.daily_units.precipitation_sum,
        },
        weather_icon: getWeatherIconFromWeathercode(true, weathercode),
        sunrise: response.daily.sunrise[index],
        sunset: response.daily.sunset[index],
        weathercode: weathercode,
        description: getWeatherDescription(weathercode),
        max_wind_speed: {
            value: response.daily.wind_speed_10m_max[index],
            unit: response.daily_units.wind_speed_10m_max,
        },
    }
}

export const getDailyWeather = async (
    latitude: number,
    longitude: number,
    forecastDays: number,
    timeZone: string
): Promise<DailyWeatherObject> => {
    const response = await externalFetchJson<Json>(
        buildWeatherForecastUrl(latitude, longitude, forecastDays, timeZone)
    )
    const count = response.daily.time.length
    const forecast: WeatherForecastResource[] = []
    for (let i = 0; i < count; i++) {
        forecast.push(createForecastDay(response, i))
    }
    return {
        latitude: response.latitude,
        longitude: response.longitude,
        timezone: response.timezone,
        days: count,
        forecast,
    }
}

const buildHourlyWeatherUrl = (latitude: number, longitude: number): string => {
    const today = dateOnly(new Date())
    const tomorrow = dateOnly(getDateInDays(1))
    const params = new URLSearchParams({
        start_date: today,
        end_date: tomorrow,
        daily: 'sunrise,sunset',
        hourly: 'temperature_2m,windspeed_10m,precipitation,weathercode',
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        timezone: 'UTC',
        current_weather: 'true',
    })
    return `${WEATHER_API_URL}/forecast/?${params.toString()}`
}

const isValidHourlyForecastTime = (
    time: string,
    forecastHours: number
): boolean =>
    !timeHasPassed(time) && !exceedsMaxForecastTime(time, forecastHours)

const createForecastHour = (
    response: Json,
    index: number,
    timeZone: string,
    units: Json
): HourlyWeatherResource => {
    const weathercode = response.hourly.weathercode[index]
    const time = response.hourly.time[index]
    const sunIsUp = timeIsDuringDay(
        time,
        response.daily.sunrise[0],
        response.daily.sunset[0]
    )
    const timeInZone = DateTime.fromISO(time, { zone: 'UTC' })
        .setZone(timeZone)
        .toFormat('yyyy-MM-dd HH:mm ZZZZ')
    return {
        time: timeInZone,
        temperature: {
            value: response.hourly.temperature_2m[index],
            unit: units.temperature_2m,
        },
        precipitation: {
            value: response.hourly.precipitation[index],
            unit: units.precipitation,
        },
        weather_icon: getWeatherIconFromWeathercode(sunIsUp, weathercode),
        windspeed: {
            value: response.hourly.windspeed_10m[index],
            unit: units.windspeed_10m,
        },
        weathercode: weathercode,
        description: getWeatherDescription(weathercode),
    }
}

export const getHourlyWeather = async (
    latitude: number,
    longitude: number,
    forecastHours: number,
    timeZone: string
): Promise<HourlyWeatherObject> => {
    const response = await externalFetchJson<Json>(
        buildHourlyWeatherUrl(latitude, longitude)
    )
    const count = response.hourly.time.length
    const units = response.hourly_units
    const forecast: HourlyWeatherResource[] = []
    for (let i = 0; i < count; i++) {
        if (isValidHourlyForecastTime(response.hourly.time[i], forecastHours)) {
            forecast.push(createForecastHour(response, i, timeZone, units))
        }
    }
    return {
        latitude: response.latitude,
        longitude: response.longitude,
        timezone: timeZone,
        forecast,
    }
}
