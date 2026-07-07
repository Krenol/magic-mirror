import { describe, it, expect, vi, afterEach } from 'vitest'
import * as externalFetchUtils from '../../common/externalFetch'
import {
    getBirthdays,
    getCalendarList,
    getEvents,
} from '../../services/googleCalendar'

describe('googleCalendar', () => {
    afterEach(() => {
        vi.restoreAllMocks()
    })

    describe('getEvents', () => {
        it('reshapes a single-day event and marks it neither all-day nor multi-day', async () => {
            vi.spyOn(externalFetchUtils, 'externalFetchJson').mockResolvedValue(
                {
                    items: [
                        {
                            summary: 'Standup',
                            description: 'Daily sync',
                            location: 'Room 1',
                            start: { dateTime: '2024-01-15T09:00:00Z' },
                            end: { dateTime: '2024-01-15T09:30:00Z' },
                        },
                    ],
                }
            )

            const result = await getEvents(
                'token',
                'primary',
                '2024-01-15T00:00:00Z',
                undefined,
                10
            )

            expect(result.count).toBe(1)
            expect(result.list[0]).toMatchObject({
                summary: 'Standup',
                allDay: false,
                multiDays: false,
            })
        })

        it('marks a 24h all-day event and a multi-day event correctly', async () => {
            vi.spyOn(externalFetchUtils, 'externalFetchJson').mockResolvedValue(
                {
                    items: [
                        {
                            summary: 'All day event',
                            start: { date: '2024-01-15' },
                            end: { date: '2024-01-16' },
                        },
                        {
                            summary: 'Multi day trip',
                            start: { date: '2024-01-15' },
                            end: { date: '2024-01-18' },
                        },
                    ],
                }
            )

            const result = await getEvents(
                'token',
                'primary',
                '2024-01-15T00:00:00Z',
                undefined,
                10
            )

            expect(result.list[0].allDay).toBe(true)
            expect(result.list[0].multiDays).toBe(false)
            expect(result.list[1].multiDays).toBe(true)
        })

        it('sends an Authorization bearer header and the calendar id in the URL', async () => {
            const spy = vi
                .spyOn(externalFetchUtils, 'externalFetchJson')
                .mockResolvedValue({ items: [] })

            await getEvents(
                'my-token',
                'someone@example.com',
                '2024-01-15T00:00:00Z',
                '2024-01-16T00:00:00Z',
                5
            )

            const [url, options] = spy.mock.calls[0]
            expect(url).toContain('/calendars/someone%40example.com/events')
            expect(url).toContain('timeMax=2024-01-16T00%3A00%3A00Z')
            expect(options).toEqual({
                headers: { Authorization: 'Bearer my-token' },
            })
        })
    })

    describe('getBirthdays', () => {
        it('strips the birthday suffix from the event summary', async () => {
            vi.spyOn(externalFetchUtils, 'externalFetchJson').mockResolvedValue(
                {
                    items: [
                        {
                            summary: "Jane Doe's Birthday",
                            start: { date: '2024-05-01' },
                        },
                    ],
                }
            )

            const result = await getBirthdays('token', 'birthdays-cal', 5)

            expect(result.list[0]).toEqual({
                name: 'Jane Doe',
                date: '2024-05-01',
            })
        })
    })

    describe('getCalendarList', () => {
        it('reshapes calendar list entries', async () => {
            vi.spyOn(externalFetchUtils, 'externalFetchJson').mockResolvedValue(
                {
                    items: [
                        { summary: 'Personal', id: 'primary', primary: true },
                        {
                            summary: 'Work',
                            id: 'work@group.calendar.google.com',
                        },
                    ],
                }
            )

            const result = await getCalendarList('token')

            expect(result).toEqual([
                { name: 'Personal', id: 'primary', primary: true },
                {
                    name: 'Work',
                    id: 'work@group.calendar.google.com',
                    primary: false,
                },
            ])
        })
    })
})
