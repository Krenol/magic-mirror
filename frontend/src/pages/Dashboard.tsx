import CurrentWeather from "../features/current_weather/CurrentWeather";
import Time from "../features/time/Time";
import React from "react";
import { Box } from "@mui/material";
import { dashboardStyle } from "../assets/styles/dashboard";
import DailyForecast from "../features/daily_forecast/DailyForecast";
import Birthdays from "../features/birthdays/Birthdays";
import HourlyWeather from "../features/hourly_forecast/HourlyForecast";
import UpcomingEvents from "../features/upcoming_events/UpcomingEvents";
import { TimeNotifications } from "../features/time_notifications/TimeNotifications";

export const Dashboard = () => {
  return (
    <React.Fragment>
      <TimeNotifications />
      <Box sx={dashboardStyle}>
        <Time />
        <Birthdays />
        <UpcomingEvents />
        <CurrentWeather />
        <HourlyWeather />
        <DailyForecast />
      </Box>
    </React.Fragment>
  );
};
