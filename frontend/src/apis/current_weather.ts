import { useQuery } from "react-query";
import { fetchJson } from "../helpers/fetch";
import { ServerStateKeysEnum } from "../helpers/statekeys";
import { REFETCH_INTERVAL, WEATHER_API } from "../constants/api";
import { LATITUDE, LONGITUDE } from "../constants/weather";
import { CurrentWeatherResource } from "../models/current_weather";

export const useGetCurrentWeather = (
  longitude: number = LONGITUDE,
  latitude: number = LATITUDE,
) =>
  useQuery<CurrentWeatherResource, Error>({
    queryKey: [ServerStateKeysEnum.current_weather, longitude, latitude],
    queryFn: async () =>
      fetchJson(
        `${WEATHER_API}/current?latitude=${latitude}&longitude=${longitude}`,
      ).catch((err) => {
        throw err;
      }),
    refetchInterval: REFETCH_INTERVAL,
  });
