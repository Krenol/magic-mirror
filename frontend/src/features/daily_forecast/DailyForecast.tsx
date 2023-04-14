import { cardStyle, dayBoxStyle, parentBoxStyle } from './style';
import ForecastItem from './forecast_item/ForecastItem';
import { useGetDailyWeather } from '../../apis/daily_weather';
import { CardFrame } from '../CardFrame';
import { Box } from '@mui/material';


const DailyForecast = () => {
    const {
        data: weather,
        isLoading,
        error
    } = useGetDailyWeather();

    const content = <Box sx={dayBoxStyle}>
        {
            weather?.forecast.map((data) => (
                <ForecastItem
                    item={data}
                    key={data.date}
                />
            ))
        }
    </Box>

    if (isLoading) return (<CardFrame boxContent={"Loading..."} cardStyle={cardStyle} parentBoxStyle={parentBoxStyle} />);

    if (error) return (<CardFrame boxContent={"Error!"} cardStyle={cardStyle} parentBoxStyle={parentBoxStyle} />);

    return (<CardFrame boxContent={content} cardStyle={cardStyle} parentBoxStyle={parentBoxStyle} />);
}

export default DailyForecast;