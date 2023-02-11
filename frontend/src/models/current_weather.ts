export type CurrentWeatherResource = {
    latitude: number,
    longitude: number,
    temperature: CurrentWeatherTemperature,
    windspeed: number,
    weathercode: number,
    update_time: string,
    weather_icon: string,
    description: string,
    precipitation_sum: number
}

export type CurrentWeatherTemperature = {
    current: number,
    min: number,
    max: number,
    feels_like: number
}
