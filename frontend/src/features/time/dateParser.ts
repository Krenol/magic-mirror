export const parseDate = (date: Date, delim: string = "."): string => {
    return `${getDayName(date, 'en-us')} ${[getDay(date), getMonth(date), getYear(date)].join(delim)}`
}

export const getTimezoneOffset = (): string => {
    const timezoneOffset = new Date().getTimezoneOffset() / -60.0;
    return timezoneOffset > 0 ? `+${timezoneOffset}` : timezoneOffset.toString();
}

const getDayName = (date: Date, locale: string) => {
    return date.toLocaleDateString(locale, { weekday: 'short' });
}

const getDay = (date: Date): string => {
    return date.getDate().toString().padStart(2, '0');
}

const getMonth = (date: Date): string => {
    return (date.getMonth() + 1).toString().padStart(2, '0');
}

const getYear = (date: Date): string => {
    return date.getFullYear().toString();
}
