import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  isNewDay,
  isNewHour,
  setIsNewDay,
  setIsNewHour,
} from "../../common/slices/timeNotificationsSlice";
import { useAppSelector } from "../../common/hooks";

export const TimeNotifications = () => {
  const dispatch = useDispatch();
  const newDayStateFlag = useAppSelector(isNewDay);
  const newHoursStateFlag = useAppSelector(isNewHour);
  const [previousDate, setPreviousDate] = useState(new Date());
  const [previousHours, setPreviousHours] = useState(previousDate.getHours());

  const handleDayCheck = useCallback(
    (currentDate: Date) => {
      const isNewDayFlag = currentDate.getDate() !== previousDate.getDate();
      if (newDayStateFlag !== isNewDayFlag) {
        dispatch(setIsNewDay(isNewDayFlag));
      }
      if (isNewDayFlag) {
        setPreviousDate(currentDate);
      }
    },
    [dispatch, newDayStateFlag, setPreviousDate, previousDate]
  );

  const handleHourCheck = useCallback(
    (currentDate: Date) => {
      const isNewHourFlag = currentDate.getHours() !== previousHours;
      if (newHoursStateFlag !== isNewHourFlag) {
        dispatch(setIsNewHour(isNewHourFlag));
      }
      if (isNewHourFlag) {
        setPreviousHours(currentDate.getHours());
      }
    },
    [dispatch, newHoursStateFlag, setPreviousHours, previousHours]
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentDate = new Date();
      handleDayCheck(currentDate);
      handleHourCheck(currentDate);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [dispatch, previousDate, handleDayCheck, handleHourCheck]);

  return null;
};
