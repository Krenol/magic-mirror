import { useQuery } from "react-query";
import { getDay, getDayName, getMonth, getTimezoneOffset, getYear } from "../app/dateParser";
import { ServerStateKeysEnum } from "../app/statekeys";
import { parseTime } from "../app/timeParser";
import { DEFAULT_LOCALE } from "../constants/defaults";
import { TimeObject } from "../models/time";

export const useGetTime = (new_day_cb?: (isNewDay: boolean) => void, delim: string = ".", locale: string = DEFAULT_LOCALE) =>
    useQuery<TimeObject, Error>({
        queryKey: [ServerStateKeysEnum.time, new_day_cb, locale],
        queryFn: async () => getTime(new_day_cb, delim, locale)
            .catch(err => { throw err; }),
        refetchInterval: 5000,
    });

const getTime = async (new_day_cb?: (isNewDay: boolean) => void, delim: string = ".", locale: string = DEFAULT_LOCALE): Promise<TimeObject> => {
    const now = new Date();
    const timeObj: TimeObject = {
        hour: parseTime(now.getHours()),
        minute: parseTime(now.getMinutes()),
        currentDate: parseDate(now, delim, locale),
        timezoneOffset: getTimezoneOffset()
    };
    if (new_day_cb) handleNewDayCb(timeObj, new_day_cb);
    return timeObj;
}

const parseDate = (date: Date, delim: string = ".", locale: string = DEFAULT_LOCALE): string => {
    return `${getDayName(date, locale)} ${[getDay(date), getMonth(date), getYear(date)].join(delim)}`
}

const handleNewDayCb = async (timeObj: TimeObject, new_day_cb: (isNewDay: boolean) => void) => {
    const isNewDay = timeObj?.hour === '00' && timeObj?.minute === '00';
    new_day_cb(isNewDay);
}