export type current_weather = {
    latitude: number,
    longitude: number,
    temperature: current_weather_temperature,
    windspeed: number,
    weathercode: number,
    update_time: string,
    weather_icon: string,
    description: string,
    precipitation_sum: number
}

export type current_weather_temperature = {
    current: number,
    min: number,
    max: number,
    feels_like: number
}