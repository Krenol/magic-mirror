import { useQuery, UseQueryResult } from 'react-query'
import { ServerStateKeysEnum } from '../common/statekeys'
import { REFETCH_INTERVAL } from '../constants/api'
import { LATITUDE, LONGITUDE } from '../constants/weather'
import { CurrentWeatherResource } from '../models/current_weather'
import { getCurrentWeather } from '../services/weather/openMeteo'

export const useGetCurrentWeather = (
    longitude: number = LONGITUDE,
    latitude: number = LATITUDE,
    enabled: boolean = true,
    timeZone: string = 'GMT'
): UseQueryResult<CurrentWeatherResource, Error> =>
    useQuery<CurrentWeatherResource, Error>({
        queryKey: [
            ServerStateKeysEnum.current_weather,
            longitude,
            latitude,
            timeZone,
        ],
        queryFn: async (): Promise<CurrentWeatherResource> =>
            getCurrentWeather(latitude, longitude, timeZone),
        refetchInterval: REFETCH_INTERVAL,
        enabled,
    })
