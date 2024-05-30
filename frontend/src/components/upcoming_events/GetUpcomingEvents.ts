import { useGetEvents } from "../../apis/events";
import {
  getDateInXDays,
  getISODayEndString,
  getISODayStartString,
} from "../../common/dateParser";
import { UpcomingEventObject, Dates } from "./types";

export const GetUpcomingEvents = (): UpcomingEventObject => {
  const dates: Dates = {
    today: new Date(),
    tmrw: getDateInXDays(1),
    overmrw: getDateInXDays(2),
  };
  const {
    data: todayEvents,
    isLoading: todayLoading,
    error: todayError,
  } = useGetEvents([
    {
      name: "maxTime",
      value: encodeURIComponent(getISODayEndString(dates.today, true)),
    },
  ]);

  const {
    data: tmrwEvents,
    isLoading: tmrwLoading,
    error: tmrwError,
  } = useGetEvents([
    {
      name: "minTime",
      value: encodeURIComponent(getISODayStartString(dates.tmrw, true)),
    },
    {
      name: "maxTime",
      value: encodeURIComponent(getISODayEndString(dates.tmrw, true)),
    },
  ]);

  const {
    data: overmrwEvents,
    isLoading: overmrwLoading,
    error: overmrwError,
  } = useGetEvents([
    {
      name: "minTime",
      value: encodeURIComponent(getISODayStartString(dates.overmrw, true)),
    },
    {
      name: "maxTime",
      value: encodeURIComponent(getISODayEndString(dates.overmrw, true)),
    },
  ]);
  return {
    todayEvents,
    tmrwEvents,
    overmrwEvents,
    loading: todayLoading || tmrwLoading || overmrwLoading,
    errors: [todayError, tmrwError, overmrwError],
    dates,
  };
};
