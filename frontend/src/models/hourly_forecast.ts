export type weather_hourly = {
    latitude: number,
    longitude: number,
    timezone: string,
    forecast: Array<forecast_hourly>
}

export type forecast_hourly = {
    time: string,
    temperature: number,
    precipitation: number,
    weather_icon: string,
    weathercode: number,
    description: string,
    windspeed: number,
}
