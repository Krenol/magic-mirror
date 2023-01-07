export const getTimezoneOffset = (): string => {
    const timezoneOffset = new Date().getTimezoneOffset() / -60.0;
    return timezoneOffset > 0 ? `+${timezoneOffset}` : timezoneOffset.toString();
}

export const getDayName = (date: Date, locale: string): string => {
    return date.toLocaleDateString(locale, { weekday: 'short' });
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
