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
import { useContext, useMemo } from "react";
import { LocationContext } from "../../common/LocationContext";
import Loading from "../loading/Loading";
import ErrorCard from "../error_card/ErrorCard";

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

  const weatherIconJsx = useMemo(
    () => (
      <CardMedia
        component="img"
        src={weatherIcon}
        alt="Current Weather Icon"
        loading="lazy"
      />
    ),
    [weatherIcon]
  );

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
        <Grid item xs={6}>
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
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={smallFontSize}
            >
              Feels like {weather?.temperature.feels_like.toFixed() ?? "-"}
              {TEMP_UNIT}
            </Typography>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={smallFontSize}
            >
              Precipitaiton:{" "}
              {weather?.precipitation_sum.toFixed(1) ??
              weather?.precipitation_sum === 0
                ? weather?.precipitation_sum
                : "-"}{" "}
              {PRECIPITATION_UNIT}
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={6}>
          {weatherIconJsx}
        </Grid>
      </Grid>
    </MediumCard>
  );
};

export default CurrentWeather;
