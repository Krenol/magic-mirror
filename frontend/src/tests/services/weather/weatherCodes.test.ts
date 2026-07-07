import { describe, it, expect } from 'vitest'
import {
    getWeatherDescription,
    getWeatherIconFromWeathercode,
    weather_code_list,
} from '../../../services/weather/weatherCodes'

describe('weatherCodes', () => {
    it('resolves the day icon for a known weathercode', () => {
        const entry = weather_code_list.find((e) => e.weathercode === 0)
        expect(entry).toBeDefined()
        expect(getWeatherIconFromWeathercode(true, 0)).toBe(
            entry?.weather_icon_day
        )
    })

    it('resolves the night icon for a known weathercode', () => {
        const entry = weather_code_list.find((e) => e.weathercode === 0)
        expect(getWeatherIconFromWeathercode(false, 0)).toBe(
            entry?.weather_icon_night
        )
    })

    it('returns the description for a known weathercode', () => {
        const entry = weather_code_list.find((e) => e.weathercode === 95)
        expect(getWeatherDescription(95)).toBe(entry?.description)
    })

    it('falls back to the unknown-weather entry for an unmapped code', () => {
        expect(getWeatherIconFromWeathercode(true, 9999)).toBe('00d')
        expect(getWeatherIconFromWeathercode(false, 9999)).toBe('00n')
        expect(getWeatherDescription(9999)).toBe('Unknown weather')
    })
})
