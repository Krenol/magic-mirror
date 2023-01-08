import CurrentWeather from '../features/current_weather/CurrentWeather';
import Time from '../features/time/Time';
import React from 'react';
import { useAppSelector } from '../app/hooks';
import { getAuthStatus } from '../features/auth/authSlice';
import { Box, Button } from '@mui/material';
import SessionCheck from '../features/auth/AuthHelper';
import { dashboardStyle } from '../assets/styles/dashboard';

import DailyForecast from '../features/daily_forecast/DailyForecast';
import Birthdays from '../features/birthdays/Birthdays';
import HourlyWeather from '../features/hourly_forecast/HourlyForecast';

export const Dashboard = () => {
  const authStatus = useAppSelector(getAuthStatus);

  return (
    <React.Fragment>
      <SessionCheck />
      <h2>Auth Status: {String(authStatus)}</h2>
      <Box sx={dashboardStyle}>
        <Time />
        <Birthdays />
        <CurrentWeather />
        <HourlyWeather />
        <DailyForecast />
      </Box>
      <Button variant="outlined" href="/logout">Logout</Button>
    </React.Fragment>
  );
}