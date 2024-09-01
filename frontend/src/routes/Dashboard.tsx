import CurrentWeather from "../components/current_weather/CurrentWeather";
import Time from "../components/time/Time";
import { Box } from "@mui/material";
import DailyForecast from "../components/daily_forecast/DailyForecast";
import Birthdays from "../components/birthdays/Birthdays";
import HourlyWeather from "../components/hourly_forecast/HourlyForecast";
import UpcomingEvents from "../components/upcoming_events/UpcomingEvents";
import { TimeContext, TimeContextProvider } from "../common/TimeContext";
import { LocationContextProvider } from "../common/LocationContext";
import { PADDING } from "../assets/styles/theme";
import { useContext, useEffect, useState } from "react";

export const Dashboard = () => {
  return (
    <LocationContextProvider>
      <TimeContextProvider>
        <DashBoardItems />
      </TimeContextProvider>
    </LocationContextProvider>
  );
};

const DashBoardItems = () => {
  const { newDay } = useContext(TimeContext);
  const [todaysDate, setTodaysDate] = useState<Date>(new Date());

  useEffect(() => {
    if (newDay) {
      setTodaysDate(new Date());
    }
  }, [newDay, setTodaysDate]);

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        gap: PADDING,
      }}
    >
      <Time />
      <Birthdays />
      <UpcomingEvents todaysDate={todaysDate} />
      <CurrentWeather />
      <HourlyWeather />
      <DailyForecast />
    </Box>
  );
};
