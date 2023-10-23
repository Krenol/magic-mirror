import ForecastItem from "./forecast_item/ForecastItem";
import { useGetHourlyWeather } from "../../apis/hourly_weather";
import { MediumCard } from "../CardFrame";
import { Grid } from "@mui/material";
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

  if (isLoading) {
    return <MediumCard>Loading...</MediumCard>;
  }

  if (error) {
    return <MediumCard>Error!</MediumCard>;
  }

  return (
    <MediumCard>
      <Grid container spacing={1} columns={10}>
        {weather?.forecast.map((val) => (
          <Grid item xs={2}>
            <ForecastItem
              item={val}
              timezone={weather?.timezone}
              key={val.time}
            />
          </Grid>
        ))}
      </Grid>
    </MediumCard>
  );
};

export default HourlyWeather;
