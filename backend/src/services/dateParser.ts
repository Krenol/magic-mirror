export const isToday = async (date: Date): Promise<boolean> => {
    return isSameDate(date, new Date())
}

export const isSameDate = (date1: Date, date2: Date): boolean => {
    return date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear()
}

export const getISODayStartString = async (date: Date): Promise<string> => {
    return `${date.toISOString().split('T')[0]}T00:00:00.000Z`
}

export const getISODayEndString = async (date: Date): Promise<string> => {
    return `${date.toISOString().split('T')[0]}T23:59:59.999Z`
}

const ISO8601_REGEX = /^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(\.\d+)?([+-][0-2]\d:[0-5]\d|Z)$/;

export const isIso8601DatetimeString = async (datetimeStr: string): Promise<boolean> => {
    return ISO8601_REGEX.test(datetimeStr)
}

export const isDate = async (date: string): Promise<boolean> => {
    return !isNaN(Date.parse(date));
}

export enum TimeUnit {
    hours = 3600000,
    minutes = 60000,
    seconds = 1000
}

export const getTimeDiff = async (date1: Date, date2: Date, unit: TimeUnit = TimeUnit.hours) => {
    return Math.abs(date1.getTime() - date2.getTime()) / unit;
}