import { useQuery } from "react-query";
import { fetchJson } from "../app/fetch";
import { ServerStateKeysEnum } from "../app/statekeys";
import { WEATHER_API } from "../constants/api";
import { LATITUDE, LONGITUDE, HOURLY_FORECAST_HOURS } from "../constants/weather";
import { HourlyWeatherList } from "../models/hourly_forecast";

export const useGetHourlyWeather = () =>
    useQuery<HourlyWeatherList, Error>({
        queryKey: [ServerStateKeysEnum.hourly_weather],
        queryFn: async () => fetchJson(`${WEATHER_API}/hourly?latitude=${LATITUDE}&longitude=${LONGITUDE}&hours=${HOURLY_FORECAST_HOURS}`)
            .catch(err => { throw err; }),
        refetchInterval: 30000,
    });
