import { useQuery } from "react-query";
import { fetchBlob } from "../app/fetch";
import { ServerStateKeysEnum } from "../app/statekeys";
import { REFETCH_INTERVAL, WEATHER_API } from "../constants/api";
import { WEATHER_ICON_ZOOM } from "../constants/weather";

export const useGetWeatherIcon = (weather_icon: string, icon_zoom: string = WEATHER_ICON_ZOOM) =>
    useQuery<string, Error>({
        queryKey: [ServerStateKeysEnum.weather_icon, weather_icon, icon_zoom],
        queryFn: async () => fetchBlob(`${WEATHER_API}/icon/${weather_icon}@${icon_zoom}`)
            .then((blob) => URL.createObjectURL(blob))
            .catch(err => { throw err; })
    });
