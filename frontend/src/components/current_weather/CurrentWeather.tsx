import Typography from "@mui/material/Typography";
import unknownWeatherIcon from "../../assets/unknown-weather.svg";
import { TEMP_UNIT, PRECIPITATION_UNIT } from "../../constants/weather";
import { CardMedia, Grid, Stack } from "@mui/material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { smallFontSize } from "../../assets/styles/theme";
import { useGetCurrentWeather } from "../../apis/current_weather";
import { MediumCard } from "../CardFrame";
import { useGetWeatherIcon } from "../../apis/weather_icon";
import { useContext } from "react";
import { LocationContext } from "../../common/LocationContext";

const CurrentWeather = () => {
  const { longitude, latitude } = useContext(LocationContext);
  const {
    data: weather,
    isLoading,
    error,
  } = useGetCurrentWeather(longitude, latitude);

  const {
    data: icon,
    isLoading: iconLoading,
    error: iconError,
  } = useGetWeatherIcon(weather?.weather_icon ?? "");

  const weatherIcon = iconError || iconLoading ? unknownWeatherIcon : icon;

  const weatherJsx = (
    <Stack spacing={1}>
      <Typography variant="h3">
        {weather?.temperature.current.toFixed() ?? "-"}
        {TEMP_UNIT}
      </Typography>
      <Stack direction={"row"}>
        <ArrowDropUpIcon />
        <Typography variant="subtitle2" color="text.primary">
          {weather?.temperature.max.toFixed() ?? "-"}
          {TEMP_UNIT}
        </Typography>
        <ArrowDropDownIcon />
        <Typography variant="subtitle2" color="text.primary">
          {weather?.temperature.min.toFixed() ?? "-"}
          {TEMP_UNIT}
        </Typography>
      </Stack>
      <Typography variant="subtitle2" color="text.secondary" sx={smallFontSize}>
        Feels like {weather?.temperature.feels_like.toFixed() ?? "-"}
        {TEMP_UNIT}
      </Typography>
      <Typography variant="subtitle2" color="text.secondary" sx={smallFontSize}>
        Precipitaiton:{" "}
        {weather?.precipitation_sum.toFixed(1) ??
        weather?.precipitation_sum === 0
          ? weather?.precipitation_sum
          : "-"}{" "}
        {PRECIPITATION_UNIT}
      </Typography>
    </Stack>
  );

  const weatherIconJsx = (
    <CardMedia
      component="img"
      src={weatherIcon}
      alt="Current Weather Icon"
      loading="lazy"
    />
  );

  if (isLoading) {
    return <MediumCard>Loading...</MediumCard>;
  }

  if (error) {
    return <MediumCard>Error!</MediumCard>;
  }

  return (
    <MediumCard>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          {weatherJsx}
        </Grid>
        <Grid item xs={6}>
          {weatherIconJsx}
        </Grid>
      </Grid>
    </MediumCard>
  );
};

export default CurrentWeather;
