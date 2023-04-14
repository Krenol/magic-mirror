import { cardStyle, hourBoxStyle, parentBoxStyle } from './style';
import ForecastItem from './forecast_item/ForecastItem';
import { useGetHourlyWeather } from '../../apis/hourly_weather';
import { CardFrame } from '../CardFrame';
import { Box } from '@mui/material';

const HourlyWeather = () => {
    const {
        data: weather,
        isLoading,
        error
    } = useGetHourlyWeather();

    const content = <Box sx={hourBoxStyle}>
        {
            weather?.forecast.map((val) => (
                <ForecastItem
                    item={val}
                    timezone={weather?.timezone}
                    key={val.time}
                />
            ))
        }
    </Box>

    if (isLoading) return (<CardFrame boxContent={"Loading..."} cardStyle={cardStyle} parentBoxStyle={parentBoxStyle} />);

    if (error) return (<CardFrame boxContent={"Error!"} cardStyle={cardStyle} parentBoxStyle={parentBoxStyle} />);

    return (<CardFrame boxContent={content} cardStyle={cardStyle} parentBoxStyle={parentBoxStyle} />);
}

export default HourlyWeather;