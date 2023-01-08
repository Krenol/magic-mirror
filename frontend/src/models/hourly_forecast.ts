export type HourlyWeather = {
    latitude: number,
    longitude: number,
    timezone: string,
    forecast: Array<HourlyWeatherResource>
}

export type HourlyWeatherResource = {
    time: string,
    temperature: number,
    precipitation: number,
    weather_icon: string,
    weathercode: number,
    description: string,
    windspeed: number,
}
