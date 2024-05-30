import ForecastItem from "./ForecastItem";
import { useGetDailyWeather } from "../../apis/daily_weather";
import { MediumCard } from "../CardFrame";
import { Grid } from "@mui/material";
import { useContext, useEffect } from "react";
import { TimeContext } from "../../common/TimeContext";
import { LocationContext } from "../../common/LocationContext";

const DailyForecast = () => {
  const { newDay } = useContext(TimeContext);
  const { longitude, latitude } = useContext(LocationContext);

  const {
    data: weather,
    isLoading,
    error,
    refetch,
  } = useGetDailyWeather(longitude, latitude);

  useEffect(() => {
    if (newDay) refetch();
  }, [newDay, refetch]);

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
          <Grid item xs={3} key={val.date}>
            <ForecastItem item={val} key={val.date} />
          </Grid>
        ))}
      </Grid>
    </MediumCard>
  );
};

export default DailyForecast;
