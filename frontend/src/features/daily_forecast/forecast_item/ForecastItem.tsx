import { Box, Stack, Typography } from "@mui/material";
import { TEMP_UNIT } from "../../../constants/weather";
import unknownWeatherIcon from "../../../assets/unknown-weather.svg";
import { WeatherForecastResource } from "../../../models/daily_forecast";
import { boldText, smallFontSize } from "../../../assets/styles/theme";
import { useGetWeatherIcon } from "../../../apis/weather_icon";
import { useGetDayName } from "../../../apis/day_name";

interface IForecastItem {
  item: WeatherForecastResource;
}

const ForecastItem = ({ item }: IForecastItem) => {
  const { data: dayName } = useGetDayName(new Date(item.date));

  const {
    data: icon,
    isLoading: iconLoading,
    error: iconError,
  } = useGetWeatherIcon(item.weather_icon);

  const weatherIcon = iconError || iconLoading ? unknownWeatherIcon : icon;

  return (
    <Stack direction={"column"}>
      <Typography variant="subtitle2" color="text.primary" align="center">
        {dayName}
      </Typography>
      <Box
        component="img"
        src={weatherIcon}
        alt="Weather Icon"
        loading="lazy"
      />
      <Stack direction={"row"} justifyContent={"center"}>
        <Typography
          variant="subtitle2"
          color="text.primary"
          sx={{ ...smallFontSize, ...boldText }}
        >
          {Math.round(item.temperature.max).toString() ?? "-"}
          {TEMP_UNIT}
        </Typography>
        &nbsp;
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={smallFontSize}
        >
          {Math.round(item.temperature.min).toString() ?? "-"}
          {TEMP_UNIT}
        </Typography>
      </Stack>
      <Typography
        variant="subtitle2"
        color="text.primary"
        align="center"
        sx={smallFontSize}
      >
        {item.precipitation.amount} {item.precipitation.amount_unit}
      </Typography>
    </Stack>
  );
};

export default ForecastItem;
