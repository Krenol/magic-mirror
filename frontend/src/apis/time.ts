import { useQuery } from "react-query";
import { getDay, getDayName, getMonth, getTimezoneOffset, getYear } from "../app/dateParser";
import { ServerStateKeysEnum } from "../app/statekeys";
import { parseTime } from "../app/timeParser";
import { TimeObject } from "../models/time";

export const useGetTime = (new_day_cb?: (isNewDay: boolean) => void) =>
    useQuery<TimeObject, Error>({
        queryKey: [ServerStateKeysEnum.time],
        queryFn: async () => getTime(new_day_cb)
            .catch(err => { throw err; }),
        refetchInterval: 5000,
    });

const getTime = async (new_day_cb?: (isNewDay: boolean) => void): Promise<TimeObject> => {
    const now = new Date();
    const timeObj: TimeObject = {
        hour: parseTime(now.getHours()),
        minute: parseTime(now.getMinutes()),
        currentDate: parseDate(now),
        timezoneOffset: getTimezoneOffset()
    };
    if (new_day_cb) handleNewDayCb(timeObj, new_day_cb);
    return timeObj;
}

const parseDate = (date: Date, delim: string = "."): string => {
    return `${getDayName(date, 'en-us')} ${[getDay(date), getMonth(date), getYear(date)].join(delim)}`
}

const handleNewDayCb = async (timeObj: TimeObject, new_day_cb: (isNewDay: boolean) => void) => {
    const isNewDay = timeObj?.hour === '00' && timeObj?.minute === '00';
    new_day_cb(isNewDay);
}