import { useQuery } from 'react-query'
import { fetchJson } from '../common/fetch'
import { ServerStateKeysEnum } from '../common/statekeys'
import { REFETCH_INTERVAL, WEATHER_API } from '../constants/api'
import {
    LATITUDE,
    LONGITUDE,
    HOURLY_FORECAST_HOURS,
} from '../constants/weather'
import { HourlyWeatherObject } from '../models/hourly_forecast'

export const useGetHourlyWeather = (
    longitude: number = LONGITUDE,
    latitude: number = LATITUDE,
    forecast_hours: number = HOURLY_FORECAST_HOURS,
    enabled: boolean = true
) =>
    useQuery<HourlyWeatherObject, Error>({
        queryKey: [
            ServerStateKeysEnum.hourly_weather,
            longitude,
            latitude,
            forecast_hours,
        ],
        enabled,
        queryFn: async () =>
            fetchJson<HourlyWeatherObject>(
                `${WEATHER_API}/hourly?latitude=${latitude}&longitude=${longitude}&hours=${forecast_hours}`
            ).catch((err) => {
                throw err
            }),
        refetchInterval: REFETCH_INTERVAL,
    })
