import CurrentWeather from "../features/current_weather/CurrentWeather";
import Time from "../features/time/Time";
import React from "react";
import { Box } from "@mui/material";
import SessionCheck from "../features/auth/AuthHelper";
import { dashboardStyle } from "../assets/styles/dashboard";
import DailyForecast from "../features/daily_forecast/DailyForecast";
import Birthdays from "../features/birthdays/Birthdays";
import HourlyWeather from "../features/hourly_forecast/HourlyForecast";
import UpcomingEvents from "../features/upcoming_events/UpcomingEvents";
import { REFETCH_INTERVAL } from "../constants/api";
import { TimeNotifications } from "../features/time_notifications/TimeNotifications";
import { AuthenticationHandler } from "../common/AuthenticationHandler";

export const Dashboard = () => {
  const authHandler = new AuthenticationHandler(3);
  return (
    <React.Fragment>
      <SessionCheck
        onUnauthenticated={authHandler.noAuth}
        refetchInterval={REFETCH_INTERVAL}
        onAuthenticated={authHandler.authSuccess}
      />
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
