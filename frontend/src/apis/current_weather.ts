import { useQuery } from "react-query";
import { fetchJson } from "../common/fetch";
import { ServerStateKeysEnum } from "../common/statekeys";
import { REFETCH_INTERVAL, WEATHER_API } from "../constants/api";
import { LATITUDE, LONGITUDE } from "../constants/weather";
import { CurrentWeatherResource } from "../models/current_weather";

export const useGetCurrentWeather = (
  longitude: number = LONGITUDE,
  latitude: number = LATITUDE,
  enabled: boolean = true
) =>
  useQuery<CurrentWeatherResource, Error>({
    queryKey: [ServerStateKeysEnum.current_weather, longitude, latitude],
    queryFn: async () =>
      fetchJson<CurrentWeatherResource>(
        `${WEATHER_API}/current?latitude=${latitude}&longitude=${longitude}`
      ).catch((err) => {
        throw err;
      }),
    refetchInterval: REFETCH_INTERVAL,
    enabled,
  });
