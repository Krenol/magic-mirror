export type weather_daily = {
    latitude: number,
    longitude: number,
    timezone: string,
    days: number,
    forecast: Array<forecast_day>
}

export type forecast_day = {
    date: string,
    temperature: temperature,
    precipitation: precipitation,
    weather_icon: string,
    sunrise: string,
    sunset: string,
    weathercode: number,
    description: string
}

export type precipitation = {
    amount: number
    hours: number
    amount_unit: string
}

export type temperature = {
    min: number,
    max: number,
    unit: string
}