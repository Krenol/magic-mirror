import ForecastItem from "./forecast_item/ForecastItem";
import { useGetHourlyWeather } from "../../apis/hourly_weather";
import { MediumCard } from "../CardFrame";
import { Grid } from "@mui/material";
import { useContext, useEffect } from "react";
import { TimeContext } from "../../common/TimeContext";
import { LocationContext } from "../../common/LocationContext";

const HourlyWeather = () => {
  const { longitude, latitude } = useContext(LocationContext);
  const { newHour } = useContext(TimeContext);
  const {
    data: weather,
    isLoading,
    error,
    refetch,
  } = useGetHourlyWeather(longitude, latitude);

  useEffect(() => {
    if (newHour) refetch();
  }, [newHour, refetch]);

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
