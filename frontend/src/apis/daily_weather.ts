import { useQuery } from 'react-query'
import { ServerStateKeysEnum } from '../common/statekeys'
import { REFETCH_INTERVAL } from '../constants/api'
import { LATITUDE, LONGITUDE, DAILY_FORECAST_DAYS } from '../constants/weather'
import { DailyWeatherObject } from '../models/daily_forecast'
import { getDailyWeather } from '../services/weather/openMeteo'

export const useGetDailyWeather = (
    longitude: number = LONGITUDE,
    latitude: number = LATITUDE,
    forecast_days: number = DAILY_FORECAST_DAYS,
    enabled: boolean = true,
    timeZone: string = 'GMT'
) =>
    useQuery<DailyWeatherObject, Error>({
        queryKey: [
            ServerStateKeysEnum.daily_weather,
            longitude,
            latitude,
            forecast_days,
            timeZone,
        ],
        enabled,
        queryFn: async () =>
            getDailyWeather(latitude, longitude, forecast_days, timeZone),
        refetchInterval: REFETCH_INTERVAL,
    })
