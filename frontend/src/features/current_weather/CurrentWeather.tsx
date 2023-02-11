import React, { useEffect, useState } from 'react';
import CardMedia from '@mui/material/CardMedia/CardMedia';
import Typography from '@mui/material/Typography';
import unknownWeatherIcon from '../../assets/unknown-weather.svg'
import { fetchBlob } from '../../app/fetch';
import { WEATHER_API } from '../../constants/api';
import { WEATHER_ICON_ZOOM, TEMP_UNIT, PRECIPITATION_UNIT } from '../../constants/weather';
import { Box } from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { cardStyle, minMaxBoxStyle, parentBoxStyle } from './style';
import { smallFontSize } from '../../assets/styles/theme';
import { useGetCurrentWeather } from '../../apis/current_weather';
import { CardFrame } from '../CardFrame';
import { useGetWeatherIcon } from '../../apis/weather_icon';

const CurrentWeather = () => {
    const {
        data: weather,
        isLoading,
        error
    } = useGetCurrentWeather();

    const {
        data: icon,
        isLoading: iconLoading,
        error: iconError
    } = useGetWeatherIcon(weather?.weather_icon || "")

    const weatherIcon = iconError || iconLoading ? unknownWeatherIcon : icon

    const boxContent = <React.Fragment>
        <Typography variant="h3">
            {weather?.temperature.current.toFixed() || "-"}{TEMP_UNIT}
        </Typography>
        <Box sx={minMaxBoxStyle}>
            <ArrowDropUpIcon />
            <Typography variant="subtitle2" color="text.primary">
                {weather?.temperature.max.toFixed() || "-"}{TEMP_UNIT}
            </Typography>
            <ArrowDropDownIcon />
            <Typography variant="subtitle2" color="text.primary">
                {weather?.temperature.min.toFixed() || "-"}{TEMP_UNIT}
            </Typography>
        </Box>
        <Typography variant="subtitle2" color="text.secondary" sx={smallFontSize}>
            Feels like {weather?.temperature.feels_like.toFixed() || "-"}{TEMP_UNIT}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary" sx={smallFontSize}>
            Precipitaiton: {weather?.precipitation_sum.toFixed(1) || weather?.precipitation_sum === 0 ? weather?.precipitation_sum : "-"} {PRECIPITATION_UNIT}
        </Typography>
    </React.Fragment>

    const cardContent = <CardMedia
        component="img"
        sx={{ width: 'auto', height: '100%' }}
        src={weatherIcon}
        alt="Current Weather Icon"
    />

    if (isLoading) return (<CardFrame boxContent={"Loading..."} cardStyle={cardStyle} parentBoxStyle={parentBoxStyle} />);

    if (error) return (<CardFrame boxContent={"Error!"} cardStyle={cardStyle} parentBoxStyle={parentBoxStyle} />);

    return (<CardFrame boxContent={boxContent} cardContent={cardContent} cardStyle={cardStyle} parentBoxStyle={parentBoxStyle} />);
}

export default CurrentWeather;