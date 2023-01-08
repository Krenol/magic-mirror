import Card from '@mui/material/Card';
import { Box } from '@mui/material';
import { cardStyle, parentBoxStyle } from './style';
import { HourlyWeatherList } from '../../models/hourly_forecast';
import { useCallback, useEffect, useState } from 'react';
import { WEATHER_API } from '../../constants/api';
import { fetchJson } from '../../app/fetch';
import { HOURLY_FORECAST_HOURS, LATITUDE, LONGITUDE } from '../../constants/weather';
import ForecastItem from './forecast_item/ForecastItem';
import { REFRESH_MILLIS } from '../../constants/app';


const HourlyWeather = () => {
    const [weather, setWeather] = useState<HourlyWeatherList>();

    const getHourlyWeather = useCallback(async () => {
        fetchJson(`${WEATHER_API}/hourly?latitude=${LATITUDE}&longitude=${LONGITUDE}&hours=${HOURLY_FORECAST_HOURS}`)
            .then(data => setWeather(data))
            .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        getHourlyWeather();
        const timer = setInterval(() => {
            getHourlyWeather();
        }, REFRESH_MILLIS);
        return () => clearInterval(timer);
    }, [getHourlyWeather]);

    return (
        <Card sx={cardStyle}>
            <Box sx={parentBoxStyle}>
                {weather?.forecast.map((data) => (
                    <ForecastItem
                        item={data}
                        timezone={weather?.timezone}
                        key={data.time}
                    />
                ))}
            </Box>
        </Card>
    );
}

export default HourlyWeather;