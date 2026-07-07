import { describe, it, expect, vi, afterEach } from 'vitest'
import * as externalFetchUtils from '../../../common/externalFetch'
import {
    getCurrentWeather,
    getDailyWeather,
    getHourlyWeather,
} from '../../../services/weather/openMeteo'

describe('openMeteo', () => {
    afterEach(() => {
        vi.restoreAllMocks()
        vi.useRealTimers()
    })

    describe('getCurrentWeather', () => {
        it('reshapes the raw Open-Meteo response into a CurrentWeatherResource', async () => {
            vi.useFakeTimers()
            vi.setSystemTime(new Date('2024-01-15T12:00:00Z'))

            vi.spyOn(externalFetchUtils, 'externalFetchJson').mockResolvedValue(
                {
                    latitude: 52.52,
                    longitude: 13.405,
                    daily: {
                        sunrise: ['2024-01-15T07:00'],
                        sunset: ['2024-01-15T17:00'],
                        temperature_2m_min: [15],
                        temperature_2m_max: [25],
                        precipitation_sum: [1.5],
                    },
                    daily_units: { precipitation_sum: 'mm' },
                    hourly: {
                        apparent_temperature: Array(24)
                            .fill(0)
                            .map((_, i) => i),
                    },
                    current_weather: {
                        time: '2024-01-15T12:00',
                        temperature: 20,
                        windspeed: 10,
                        weathercode: 0,
                    },
                    current_weather_units: {
                        temperature: '°C',
                        windspeed: 'km/h',
                    },
                }
            )

            const result = await getCurrentWeather(52.52, 13.405, 'GMT')

            expect(result.temperature).toEqual({
                current: 20,
                min: 15,
                max: 25,
                feels_like: 12,
                unit: '°C',
            })
            expect(result.precipitation).toEqual({ value: 1.5, unit: 'mm' })
            expect(result.weather_icon).toBe('01d')
            expect(result.description).toBe(
                'Cloud development not observed or not observable'
            )
        })
    })

    describe('getDailyWeather', () => {
        it('builds one forecast entry per returned day', async () => {
            vi.spyOn(externalFetchUtils, 'externalFetchJson').mockResolvedValue(
                {
                    latitude: 1,
                    longitude: 2,
                    timezone: 'GMT',
                    daily: {
                        time: ['2024-01-16', '2024-01-17'],
                        temperature_2m_min: [10, 11],
                        temperature_2m_max: [20, 21],
                        precipitation_sum: [0, 1],
                        precipitation_hours: [0, 2],
                        weathercode: [0, 61],
                        sunrise: ['2024-01-16T07:00', '2024-01-17T07:00'],
                        sunset: ['2024-01-16T17:00', '2024-01-17T17:00'],
                        wind_speed_10m_max: [5, 6],
                    },
                    daily_units: {
                        temperature_2m_max: '°C',
                        precipitation_sum: 'mm',
                        wind_speed_10m_max: 'km/h',
                    },
                }
            )

            const result = await getDailyWeather(1, 2, 2, 'GMT')

            expect(result.days).toBe(2)
            expect(result.forecast).toHaveLength(2)
            expect(result.forecast[1].weathercode).toBe(61)
            expect(result.forecast[1].description).toBe(
                'Rain, not freezing, continuous'
            )
        })
    })

    describe('getHourlyWeather', () => {
        it('filters out hours that have already passed', async () => {
            vi.useFakeTimers()
            vi.setSystemTime(new Date('2024-01-15T10:00:00Z'))

            vi.spyOn(externalFetchUtils, 'externalFetchJson').mockResolvedValue(
                {
                    latitude: 1,
                    longitude: 2,
                    daily: {
                        sunrise: ['2024-01-15T07:00'],
                        sunset: ['2024-01-15T17:00'],
                    },
                    hourly: {
                        time: [
                            '2024-01-15T09:00',
                            '2024-01-15T11:00',
                            '2024-01-15T12:00',
                        ],
                        temperature_2m: [5, 6, 7],
                        windspeed_10m: [1, 2, 3],
                        precipitation: [0, 0, 0.2],
                        weathercode: [0, 1, 61],
                    },
                    hourly_units: {
                        temperature_2m: '°C',
                        windspeed_10m: 'km/h',
                        precipitation: 'mm',
                    },
                }
            )

            const result = await getHourlyWeather(1, 2, 24, 'UTC')

            // The 09:00 entry is in the past relative to the mocked 10:00 "now"
            expect(result.forecast).toHaveLength(2)
            expect(result.forecast[0].temperature.value).toBe(6)
        })
    })
})
