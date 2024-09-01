import { useQuery } from "react-query";
import { fetchJson } from "../common/fetch";
import { ServerStateKeysEnum } from "../common/statekeys";
import { REFETCH_INTERVAL, WEATHER_API } from "../constants/api";
import { LATITUDE, LONGITUDE, DAILY_FORECAST_DAYS } from "../constants/weather";
import { DailyWeatherObject } from "../models/daily_forecast";

export const useGetDailyWeather = (
  longitude: number = LONGITUDE,
  latitude: number = LATITUDE,
  forecast_days: number = DAILY_FORECAST_DAYS,
  enabled: boolean = true
) =>
  useQuery<DailyWeatherObject, Error>({
    queryKey: [
      ServerStateKeysEnum.daily_weather,
      longitude,
      latitude,
      forecast_days,
    ],
    enabled,
    queryFn: async () =>
      fetchJson<DailyWeatherObject>(
        `${WEATHER_API}/forecast?latitude=${latitude}&longitude=${longitude}&days=${forecast_days}`
      ).catch((err) => {
        throw err;
      }),
    refetchInterval: REFETCH_INTERVAL,
  });
