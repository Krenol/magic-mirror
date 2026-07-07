export const sunIsCurrentlyUp = (sunrise: string, sunset: string): boolean => {
    const now = new Date()
    const sunriseDate = new Date(sunrise)
    const sunsetDate = new Date(sunset)
    return dateIsDuringDay(now, sunriseDate, sunsetDate)
}

export const dateIsDuringDay = (
    time: Date,
    sunrise: Date,
    sunset: Date
): boolean => {
    return (
        time.getTime() > sunrise.getTime() && time.getTime() < sunset.getTime()
    )
}

export const timeIsDuringDay = (
    time: string,
    sunrise: string,
    sunset: string
): boolean => {
    const timeDate = new Date(time)
    const sunriseDate = new Date(sunrise)
    const sunsetDate = new Date(sunset)
    return dateIsDuringDay(timeDate, sunriseDate, sunsetDate)
}

export const timeHasPassed = (time: string): boolean => {
    const timeDate = new Date(time)
    const now = new Date()
    return now.getTime() > timeDate.getTime()
}

export const exceedsMaxForecastTime = (
    time: string,
    maxTime: number
): boolean => {
    const timeDate = new Date(time)
    const now = new Date()
    return (timeDate.getTime() - now.getTime()) / 3.6e6 > maxTime
}
