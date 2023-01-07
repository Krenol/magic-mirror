import Card from '@mui/material/Card';
import { useCallback, useEffect, useState } from 'react';
import CardMedia from '@mui/material/CardMedia/CardMedia';
import Typography from '@mui/material/Typography';
import unknownWeatherIcon from '../../assets/unknown-weather.svg'
import { fetchBlob, fetchJson } from '../../app/fetch';
import { WEATHER_API } from '../../constants/api';
import { LATITUDE, WEATHER_ICON_ZOOM, LONGITUDE, TEMP_UNIT, PRECIPITATION_UNIT } from '../../constants/weather';
import { Weather } from '../../models/weather';
import { parseWeatherJson } from './parser';
import { Box } from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { cardStyle, minMaxBoxStyle, parentBoxStyle } from './style';
import { REFRESH_MILLIS } from '../../constants/app';
import { smallFontSize } from '../../assets/styles/theme';
import { current_weather } from '../../models/current_weather';

const CurrentWeather = () => {
    const [weather, setWeather] = useState<Weather>();
    const [icon, setIcon] = useState<string>(unknownWeatherIcon);

    const setWeatherData = useCallback(async (data: any) => {
        const newWeather = await parseWeatherJson(data);
        setWeather(newWeather);
    }, [])

    const getCurrentWeather = useCallback(async () => {
        fetchJson(`${WEATHER_API}/current?latitude=${LATITUDE}&longitude=${LONGITUDE}`)
            .then(data => setWeatherData(data as current_weather))
            .catch(err => console.log(err));
    }, [setWeatherData]);

    useEffect(() => {
        getCurrentWeather();
        const timer = setInterval(() => {
            getCurrentWeather();
        }, REFRESH_MILLIS);
        return () => clearInterval(timer);
    }, [getCurrentWeather]);

    useEffect(() => {
        fetchBlob(`${WEATHER_API}/icon/${weather?.iconCode}@${WEATHER_ICON_ZOOM}`)
            .then((blob) => URL.createObjectURL(blob))
            .then(icon => setIcon(icon))
            .catch(err => setIcon(unknownWeatherIcon));
    }, [weather?.iconCode]);

    return (
        <Card sx={cardStyle}>
            <Box sx={parentBoxStyle}>
                <Typography variant="h3">
                    {weather?.currentTemp || "-"}{TEMP_UNIT}
                </Typography>
                <Box sx={minMaxBoxStyle}>
                    <ArrowDropUpIcon />
                    <Typography variant="subtitle2" color="text.primary">
                        {weather?.todayMaxTemp || "-"}{TEMP_UNIT}
                    </Typography>
                    <ArrowDropDownIcon />
                    <Typography variant="subtitle2" color="text.primary">
                        {weather?.todayMinTemp || "-"}{TEMP_UNIT}
                    </Typography>
                </Box>
                <Typography variant="subtitle2" color="text.secondary" sx={smallFontSize}>
                    Feels like {weather?.feelsLike || "-"}{TEMP_UNIT}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary" sx={smallFontSize}>
                    Precipitaiton: {weather?.precipitation || weather?.precipitation === 0 ? weather?.precipitation : "-"} {PRECIPITATION_UNIT}
                </Typography>
            </Box>
            <CardMedia
                component="img"
                sx={{ width: 'auto', height: '100%' }}
                src={icon}
                alt="Current Weather Icon"
            />
        </Card>
    );
}

export default CurrentWeather;