import { Box, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { fetchBlob } from '../../../app/fetch';
import { WEATHER_API } from '../../../constants/api';
import { TEMP_UNIT, WEATHER_ICON_ZOOM } from '../../../constants/weather';
import unknownWeatherIcon from '../../../assets/unknown-weather.svg'
import { WeatherForecastResource } from '../../../models/daily_forecast';
import { forecastImg, minMaxBoxStyle, dailyStyle } from '../style';
import { getDayName } from '../../../app/dateParser';
import { boldText, smallFontSize } from '../../../assets/styles/theme';

interface IForecastItem {
    item: WeatherForecastResource,
}

const ForecastItem = ({ item }: IForecastItem) => {
    const [icon, setIcon] = useState<string>(unknownWeatherIcon);
    const [dayName, setDayName] = useState<string>("")

    const getWeatherIcon = useCallback(async () => {
        fetchBlob(`${WEATHER_API}/icon/${item.weather_icon}@${WEATHER_ICON_ZOOM}`)
            .then((blob) => URL.createObjectURL(blob))
            .then(icon => setIcon(icon))
            .catch(() => setIcon(unknownWeatherIcon));
    }, [item.weather_icon])

    useEffect(() => {
        getWeatherIcon();
        const date = new Date(item.date);
        setDayName(getDayName(date, 'en-us'));
    }, [item.date, getWeatherIcon]);

    return (
        <Box sx={dailyStyle}>
            <Typography variant="subtitle1" color="text.primary" align="center">
                {dayName}
            </Typography>
            <Box
                component="img"
                sx={forecastImg}
                src={icon}
                alt="Weather Icon"
            />
            <Box sx={minMaxBoxStyle}>
                <Typography variant="subtitle2" color="text.primary" sx={{ ...smallFontSize, ...boldText }}>
                    {Math.round(item.temperature.max) || "-"}{TEMP_UNIT}
                </Typography>
                &nbsp;
                <Typography variant="subtitle2" color="text.secondary" sx={smallFontSize}>
                    {Math.round(item.temperature.min) || "-"}{TEMP_UNIT}
                </Typography>
            </Box>
            <Typography variant="subtitle2" color="text.primary" align='center' sx={smallFontSize}>
                {item.precipitation.amount} {item.precipitation.amount_unit}
            </Typography>
        </Box>
    );
}

export default ForecastItem;