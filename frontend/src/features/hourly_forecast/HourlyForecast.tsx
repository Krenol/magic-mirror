import { cardStyle, hourBoxStyle, parentBoxStyle } from "./style";
import ForecastItem from "./forecast_item/ForecastItem";
import { useGetHourlyWeather } from "../../apis/hourly_weather";
import { CardFrame } from "../CardFrame";
import { Box } from "@mui/material";
import { useAppSelector } from "../../common/hooks";
import { getLocation } from "../../common/slices/locationSlice";
import { isNewHour } from "../../common/slices/timeNotificationsSlice";
import { useEffect } from "react";

const HourlyWeather = () => {
  const loc = useAppSelector(getLocation);
  const newHourBegun = useAppSelector(isNewHour);
  const {
    data: weather,
    isLoading,
    error,
    refetch,
  } = useGetHourlyWeather(loc.longitude, loc.latitude);

  useEffect(() => {
    if (newHourBegun) refetch();
  }, [newHourBegun, refetch]);

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
