import ForecastItem from "./ForecastItem";
import { useGetDailyWeather } from "../../apis/daily_weather";
import { MediumCard } from "../CardFrame";
import { Grid } from "@mui/material";
import { useContext, useEffect } from "react";
import { TimeContext } from "../../common/TimeContext";
import { LocationContext } from "../../common/LocationContext";
import Loading from "../loading/Loading";
import ErrorCard from "../error_card/ErrorCard";

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

  if (!longitude || !latitude) {
    return (
      <ErrorCard
        Card={MediumCard}
        error={
          "Longitude and or latitude are not set. Please update your location in the settings"
        }
        showSettingsBtn
      />
    );
  }

  if (isLoading) {
    return <Loading Card={MediumCard} />;
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
