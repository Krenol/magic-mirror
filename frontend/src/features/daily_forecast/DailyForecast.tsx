import { cardStyle, dayBoxStyle, parentBoxStyle } from "./style";
import ForecastItem from "./forecast_item/ForecastItem";
import { useGetDailyWeather } from "../../apis/daily_weather";
import { CardFrame } from "../CardFrame";
import { Box } from "@mui/material";
import { getLocation } from "../location_service/locationSlice";
import { useAppSelector } from "../../helpers/hooks";

const DailyForecast = () => {
  const loc = useAppSelector(getLocation);
  const {
    data: weather,
    isLoading,
    error,
  } = useGetDailyWeather(loc.longitude, loc.latitude);

  const content = (
    <Box sx={dayBoxStyle}>
      {weather?.forecast.map((data) => (
        <ForecastItem item={data} key={data.date} />
      ))}
    </Box>
  );

  if (isLoading)
    return (
      <CardFrame
        boxContent={"Loading..."}
        cardStyle={cardStyle}
        parentBoxStyle={parentBoxStyle}
      />
    );

  if (error)
    return (
      <CardFrame
        boxContent={"Error!"}
        cardStyle={cardStyle}
        parentBoxStyle={parentBoxStyle}
      />
    );

  return (
    <CardFrame
      boxContent={content}
      cardStyle={cardStyle}
      parentBoxStyle={parentBoxStyle}
    />
  );
};

export default DailyForecast;
