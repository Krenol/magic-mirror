import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { fetchBlob } from '../../../app/fetch';
import { WEATHER_API } from '../../../constants/api';
import { PRECIPITATION_UNIT, TEMP_UNIT, WEATHER_ICON_ZOOM } from '../../../constants/weather';
import unknownWeatherIcon from '../../../assets/unknown-weather.svg'
import { forecast_hourly } from '../../../models/hourly_forecast';
import { parseTime } from '../../../app/timeParser';
import { forecastImg, hourStyle } from '../style';

interface IForecastItem {
    item: forecast_hourly,
    timezone: string
}

const ForecastItem = ({ item, timezone }: IForecastItem) => {
    const [icon, setIcon] = useState<string>(unknownWeatherIcon);
    const [hours, setHours] = useState("");
    const [minutes, setMinutes] = useState("");

    useEffect(() => {
        const setTime = async () => {
            const t = new Date(item.time + getTimeOffset());
            setHours(parseTime(t.getHours()));
            setMinutes(parseTime(t.getMinutes()));
        }

        const getTimeOffset = (): string => {
            let time = timezone.replace(/GMT[+-]/i, '');
            let symbol = timezone.replace(/GMT([+-]).*/i, "$1")
            let offset = `${symbol}${time.padStart(2, "0")}`;
            return time.includes(":") ? offset.padEnd(6, "0") : `${offset}:00`
        }

        fetchBlob(`${WEATHER_API}/icon/${item.weather_icon}@${WEATHER_ICON_ZOOM}`)
            .then((blob) => URL.createObjectURL(blob))
            .then(icon => setIcon(icon))
            .catch(() => setIcon(unknownWeatherIcon));
        setTime();
    }, [item.weather_icon, timezone, item.time]);

    return (
        <Box sx={hourStyle}>
            <Typography variant="subtitle2" color="text.secondary" component="div">
                {hours}:{minutes}
            </Typography>
            <Box
                component="img"
                sx={forecastImg}
                src={icon}
                alt="Weather Icon"
            />
            <Typography variant="subtitle2" color="text.secondary" component="div">
                {Math.round(item.temperature)}{TEMP_UNIT}
            </Typography>
            <Typography variant="subtitle2" color="text.secondary" component="div">
                {item.precipitation}  {PRECIPITATION_UNIT}
            </Typography>
        </Box>
    );
}

export default ForecastItem;