import { WeekdayFormat } from "../models/time";
import { parseTime } from "./timeParser";

export const getTimezoneOffset = (): string => {
    const timezoneOffset = new Date().getTimezoneOffset() / -60.0;
    return timezoneOffset > 0 ? `+${timezoneOffset}` : timezoneOffset.toString();
}

export const getLocaleDateString = (date: Date, locale: string, opts: Intl.DateTimeFormatOptions) => {
    return date.toLocaleDateString(locale, opts);
}

export const getDayName = (date: Date, locale: string, weekdayFormat: WeekdayFormat = 'short'): string => {
    return getLocaleDateString(date, locale, { weekday: weekdayFormat });
}

export const getDay = (date: Date): string => {
    return date.getDate().toString().padStart(2, '0');
}

export const getMonth = (date: Date): string => {
    return (date.getMonth() + 1).toString().padStart(2, '0');
}

export const getYear = (date: Date): string => {
    return date.getFullYear().toString();
}

export const getIsoDate = (date: Date): string => {
    return `${getYear(date)}-${getMonth(date)}-${getDay(date)}`
}

export const getDate = (date: Date): string => {
    return `${getDay(date)}.${getMonth(date)}.${getYear(date)}`
}

export const getTimeDifferenceInHours = async (startDate: Date, endDate: Date): Promise<number> => {
    const diffTime = endDate.getTime() - startDate.getTime();
    return diffTime * 2.7777777777778E-7;
}

export const getDifferenceInDays = async (startDate: Date, endDate: Date): Promise<number> => {
    const diffTime = endDate.getTime() - startDate.getTime();
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

export const isToday = async (date: Date): Promise<boolean> => {
    return isSameDate(date, new Date());
}

export const isSameDate = async (date1: Date, date2: Date): Promise<boolean> => {
    return date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear()
}

export const getDateInXDays = (daysInFuture: number = 0): Date => {
    let date = new Date();
    date.setDate(date.getDate() + daysInFuture);
    return date;
}

export const getISODayStartString = (date: Date): string => {
    return `${getIsoDate(date)}T00:00:00.000Z`
}

export const getISODayEndString = (date: Date): string => {
    return `${getIsoDate(date)}T23:59:59.999Z`
}

export const getTimeFromDate = (date: Date): string => {
    return `${parseTime(date.getHours())}:${parseTime(date.getMinutes())}`
}