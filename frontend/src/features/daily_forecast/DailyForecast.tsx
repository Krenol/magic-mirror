import ForecastItem from "./forecast_item/ForecastItem";
import { useGetDailyWeather } from "../../apis/daily_weather";
import { MediumCard } from "../CardFrame";
import { Grid } from "@mui/material";
import { getLocation } from "../../common/slices/locationSlice";
import { useAppSelector } from "../../common/hooks";
import { isNewDay } from "../../common/slices/timeNotificationsSlice";
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

  if (isLoading) {
    return <MediumCard>Loading...</MediumCard>;
  }

  if (error) {
    return <MediumCard>Error!</MediumCard>;
  }

  return (
    <MediumCard>
      <Grid container spacing={1}>
        {weather?.forecast.map((val) => (
          <Grid item xs={3}>
            <ForecastItem item={val} key={val.date} />
          </Grid>
        ))}
      </Grid>
    </MediumCard>
  );
};

export default DailyForecast;
