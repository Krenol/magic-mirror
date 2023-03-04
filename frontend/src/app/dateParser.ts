import { WeekdayFormat } from "../models/time";

export const getTimezoneOffset = (): string => {
    const timezoneOffset = new Date().getTimezoneOffset() / -60.0;
    return timezoneOffset > 0 ? `+${timezoneOffset}` : timezoneOffset.toString();
}

export const getDayName = (date: Date, locale: string, weekdayFormat: WeekdayFormat = 'short'): string => {
    return date.toLocaleDateString(locale, { weekday: weekdayFormat });
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

export const getDifferenceInDays = async (startDate: Date, endDate: Date): Promise<number> => {
    const diffTime = endDate.getTime() - startDate.getTime();
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

export const isToday = async (date: Date): Promise<boolean> => {
    let today = new Date()
    console.log(date.toString())
    return date.getDate() == today.getDate() &&
        date.getMonth() == today.getMonth() &&
        date.getFullYear() == today.getFullYear()
}