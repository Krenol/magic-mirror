import { cardStyle, parentBoxStyle } from './style';
import ForecastItem from './forecast_item/ForecastItem';
import { useGetHourlyWeather } from '../../apis/hourly_weather';
import { CardFrame } from '../CardFrame';

const HourlyWeather = () => {
    const {
        data: weather,
        isLoading,
        error
    } = useGetHourlyWeather();

    const content = weather?.forecast.map((val) => (
        <ForecastItem
            item={val}
            timezone={weather?.timezone}
            key={val.time}
        />
    ));

    if (isLoading) return (<CardFrame boxContent={"Loading..."} cardStyle={cardStyle} parentBoxStyle={parentBoxStyle} />);

    if (error) return (<CardFrame boxContent={"Error!"} cardStyle={cardStyle} parentBoxStyle={parentBoxStyle} />);

    return (<CardFrame boxContent={content} cardStyle={cardStyle} parentBoxStyle={parentBoxStyle} />);
}

export default HourlyWeather;