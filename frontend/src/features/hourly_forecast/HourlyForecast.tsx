import { cardStyle, hourBoxStyle, parentBoxStyle } from "./style";
import ForecastItem from "./forecast_item/ForecastItem";
import { useGetHourlyWeather } from "../../apis/hourly_weather";
import { CardFrame } from "../CardFrame";
import { Box } from "@mui/material";
import { useAppSelector } from "../../helpers/hooks";
import { getLocation } from "../location_service/locationSlice";

const HourlyWeather = () => {
  const loc = useAppSelector(getLocation);
  const {
    data: weather,
    isLoading,
    error,
  } = useGetHourlyWeather(loc.longitude, loc.latitude);

  const content = (
    <Box sx={hourBoxStyle}>
      {weather?.forecast.map((val) => (
        <ForecastItem item={val} timezone={weather?.timezone} key={val.time} />
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

export default HourlyWeather;
