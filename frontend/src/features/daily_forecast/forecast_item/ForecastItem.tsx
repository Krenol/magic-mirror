import { Box, Typography } from '@mui/material';
import { TEMP_UNIT } from '../../../constants/weather';
import unknownWeatherIcon from '../../../assets/unknown-weather.svg'
import { WeatherForecastResource } from '../../../models/daily_forecast';
import { forecastImg, minMaxBoxStyle, dailyStyle } from '../style';
import { boldText, smallFontSize } from '../../../assets/styles/theme';
import { useGetWeatherIcon } from '../../../apis/weather_icon';
import { useGetDayName } from '../../../apis/day_name';

interface IForecastItem {
    item: WeatherForecastResource,
}

const ForecastItem = ({ item }: IForecastItem) => {
    const {
        data: dayName
    } = useGetDayName(new Date(item.date))

    const {
        data: icon,
        isLoading: iconLoading,
        error: iconError
    } = useGetWeatherIcon(item.weather_icon)

    const weatherIcon = iconError || iconLoading ? unknownWeatherIcon : icon

    return (
        <Box sx={dailyStyle}>
            <Typography variant="subtitle1" color="text.primary" align="center">
                {dayName}
            </Typography>
            <Box
                component="img"
                sx={forecastImg}
                src={weatherIcon}
                alt="Weather Icon"
                loading='lazy'
            />
            <Box sx={minMaxBoxStyle}>
                <Typography variant="subtitle2" color="text.primary" sx={{ ...smallFontSize, ...boldText }}>
                    {Math.round(item.temperature.max).toString() || "-"}{TEMP_UNIT}
                </Typography>
                &nbsp;
                <Typography variant="subtitle2" color="text.secondary" sx={smallFontSize}>
                    {Math.round(item.temperature.min).toString() || "-"}{TEMP_UNIT}
                </Typography>
            </Box>
            <Typography variant="subtitle2" color="text.primary" align='center' sx={smallFontSize}>
                {item.precipitation.amount} {item.precipitation.amount_unit}
            </Typography>
        </Box>
    );
}

export default ForecastItem;