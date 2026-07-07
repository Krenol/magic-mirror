import { describe, it, expect, vi, afterEach } from 'vitest'
import {
    dateIsDuringDay,
    sunIsCurrentlyUp,
    timeIsDuringDay,
    timeHasPassed,
    exceedsMaxForecastTime,
} from '../../../services/weather/daynight'

describe('daynight', () => {
    afterEach(() => {
        vi.useRealTimers()
    })

    describe('dateIsDuringDay', () => {
        it('returns true when time is strictly between sunrise and sunset', () => {
            const sunrise = new Date('2024-01-15T07:00:00Z')
            const sunset = new Date('2024-01-15T17:00:00Z')
            expect(
                dateIsDuringDay(
                    new Date('2024-01-15T12:00:00Z'),
                    sunrise,
                    sunset
                )
            ).toBe(true)
        })

        it('returns false before sunrise or after sunset', () => {
            const sunrise = new Date('2024-01-15T07:00:00Z')
            const sunset = new Date('2024-01-15T17:00:00Z')
            expect(
                dateIsDuringDay(
                    new Date('2024-01-15T06:00:00Z'),
                    sunrise,
                    sunset
                )
            ).toBe(false)
            expect(
                dateIsDuringDay(
                    new Date('2024-01-15T18:00:00Z'),
                    sunrise,
                    sunset
                )
            ).toBe(false)
        })
    })

    describe('sunIsCurrentlyUp', () => {
        it('reflects the current time against sunrise/sunset', () => {
            vi.useFakeTimers()
            vi.setSystemTime(new Date('2024-01-15T12:00:00Z'))
            expect(
                sunIsCurrentlyUp('2024-01-15T07:00:00Z', '2024-01-15T17:00:00Z')
            ).toBe(true)

            vi.setSystemTime(new Date('2024-01-15T20:00:00Z'))
            expect(
                sunIsCurrentlyUp('2024-01-15T07:00:00Z', '2024-01-15T17:00:00Z')
            ).toBe(false)
        })
    })

    describe('timeIsDuringDay', () => {
        it('parses ISO strings and delegates to dateIsDuringDay', () => {
            expect(
                timeIsDuringDay(
                    '2024-01-15T12:00:00Z',
                    '2024-01-15T07:00:00Z',
                    '2024-01-15T17:00:00Z'
                )
            ).toBe(true)
        })
    })

    describe('timeHasPassed', () => {
        it('returns true for times in the past', () => {
            vi.useFakeTimers()
            vi.setSystemTime(new Date('2024-01-15T12:00:00Z'))
            expect(timeHasPassed('2024-01-15T11:00:00Z')).toBe(true)
            expect(timeHasPassed('2024-01-15T13:00:00Z')).toBe(false)
        })
    })

    describe('exceedsMaxForecastTime', () => {
        it('returns true once the time is beyond the max forecast window', () => {
            vi.useFakeTimers()
            vi.setSystemTime(new Date('2024-01-15T00:00:00Z'))
            expect(exceedsMaxForecastTime('2024-01-15T23:00:00Z', 24)).toBe(
                false
            )
            expect(exceedsMaxForecastTime('2024-01-16T01:00:00Z', 24)).toBe(
                true
            )
        })
    })
})
