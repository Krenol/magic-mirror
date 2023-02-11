import { cardStyle, parentBoxStyle } from './style';
import ForecastItem from './forecast_item/ForecastItem';
import { useGetDailyWeather } from '../../apis/daily_weather';
import { CardFrame } from '../CardFrame';


const DailyForecast = () => {
    const {
        data: weather,
        isLoading,
        error
    } = useGetDailyWeather();

    const content = weather?.forecast.map((data) => (
        <ForecastItem
            item={data}
            key={data.date}
        />
    ));

    if (isLoading) return (<CardFrame boxContent={"Loading..."} cardStyle={cardStyle} parentBoxStyle={parentBoxStyle} />);

    if (error) return (<CardFrame boxContent={"Error!"} cardStyle={cardStyle} parentBoxStyle={parentBoxStyle} />);

    return (<CardFrame boxContent={content} cardStyle={cardStyle} parentBoxStyle={parentBoxStyle} />);
}

export default DailyForecast;