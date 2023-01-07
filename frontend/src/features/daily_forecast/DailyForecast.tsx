import Card from '@mui/material/Card';
import { Box } from '@mui/material';
import { cardStyle, parentBoxStyle } from './style';
import { useCallback, useEffect, useState } from 'react';
import { WEATHER_API } from '../../constants/api';
import { fetchJson } from '../../app/fetch';
import { DAILY_FORECAST_DAYS, LATITUDE, LONGITUDE } from '../../constants/weather';
import ForecastItem from './forecast_item/ForecastItem';
import { REFRESH_MILLIS } from '../../constants/app';
import { weather_daily } from '../../models/daily_forecast';


const DailyForecast = () => {
    const [weather, setWeather] = useState<weather_daily>();

    const getDailyWeather = useCallback(async () => {
        fetchJson(`${WEATHER_API}/forecast?latitude=${LATITUDE}&longitude=${LONGITUDE}&days=${DAILY_FORECAST_DAYS}`)
            .then(data => setWeather(data))
            .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        getDailyWeather();
        const timer = setInterval(() => {
            getDailyWeather();
        }, REFRESH_MILLIS);
        return () => clearInterval(timer);
    }, [getDailyWeather]);

    return (
        <Card sx={cardStyle}>
            <Box sx={parentBoxStyle}>
                {weather?.forecast.map((data) => (
                    <ForecastItem
                        item={data}
                        timezone={weather?.timezone}
                        key={data.date}
                    />
                ))}
            </Box>
        </Card>
    );
}

export default DailyForecast;