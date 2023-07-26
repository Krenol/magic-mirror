import { cardStyle, dayBoxStyle, parentBoxStyle } from "./style";
import ForecastItem from "./forecast_item/ForecastItem";
import { useGetDailyWeather } from "../../apis/daily_weather";
import { CardFrame } from "../CardFrame";
import { Box } from "@mui/material";
import { getLocation } from "../location_loader/locationSlice";
import { useAppSelector } from "../../helpers/hooks";
import { isNewDay } from "../time_notifications/timeNotificationsSlice";
import { useEffect } from "react";

const DailyForecast = () => {
  const newDayBegun = useAppSelector(isNewDay);
  const loc = useAppSelector(getLocation);

  const {
    data: weather,
    isLoading,
    error,
    refetch,
  } = useGetDailyWeather(loc.longitude, loc.latitude);

  useEffect(() => {
    if (newDayBegun) refetch();
  }, [newDayBegun, refetch]);

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
