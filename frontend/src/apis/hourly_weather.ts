import { useQuery, UseQueryResult } from 'react-query'
import { ServerStateKeysEnum } from '../common/statekeys'
import { REFETCH_INTERVAL } from '../constants/api'
import {
    LATITUDE,
    LONGITUDE,
    HOURLY_FORECAST_HOURS,
} from '../constants/weather'
import { HourlyWeatherObject } from '../models/hourly_forecast'
import { getHourlyWeather } from '../services/weather/openMeteo'

export const useGetHourlyWeather = (
    longitude: number = LONGITUDE,
    latitude: number = LATITUDE,
    forecast_hours: number = HOURLY_FORECAST_HOURS,
    enabled: boolean = true,
    timeZone: string = 'GMT'
): UseQueryResult<HourlyWeatherObject, Error> =>
    useQuery<HourlyWeatherObject, Error>({
        queryKey: [
            ServerStateKeysEnum.hourly_weather,
            longitude,
            latitude,
            forecast_hours,
            timeZone,
        ],
        enabled,
        queryFn: async (): Promise<HourlyWeatherObject> =>
            getHourlyWeather(latitude, longitude, forecast_hours, timeZone),
        refetchInterval: REFETCH_INTERVAL,
    })
