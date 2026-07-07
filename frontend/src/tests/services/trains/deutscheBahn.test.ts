import { describe, it, expect, vi, afterEach } from 'vitest'
import * as externalFetchUtils from '../../../common/externalFetch'
import {
    getConnections,
    searchStations,
} from '../../../services/trains/deutscheBahn'

describe('deutscheBahn', () => {
    afterEach(() => {
        vi.restoreAllMocks()
    })

    describe('searchStations', () => {
        it('filters to stations/stops and reshapes to TrainStation', async () => {
            vi.spyOn(externalFetchUtils, 'externalFetchJson').mockResolvedValue(
                [
                    {
                        type: 'station',
                        id: '8011160',
                        name: 'Berlin Hbf',
                        location: { latitude: 52.5, longitude: 13.4 },
                    },
                    {
                        type: 'poi',
                        id: 'poi-1',
                        name: 'Some POI',
                    },
                    {
                        type: 'stop',
                        id: '8000105',
                        name: 'Frankfurt (Main) Hbf',
                    },
                ]
            )

            const result = await searchStations('Berlin', 10)

            expect(result).toEqual([
                {
                    id: '8011160',
                    name: 'Berlin Hbf',
                    latitude: 52.5,
                    longitude: 13.4,
                },
                {
                    id: '8000105',
                    name: 'Frankfurt (Main) Hbf',
                    latitude: undefined,
                    longitude: undefined,
                },
            ])
        })
    })

    describe('getConnections', () => {
        it('computes duration and falls back to planned times when actuals are missing', async () => {
            vi.spyOn(externalFetchUtils, 'externalFetchJson').mockResolvedValue(
                {
                    journeys: [
                        {
                            legs: [
                                {
                                    origin: { name: 'Berlin Hbf' },
                                    destination: {
                                        name: 'Frankfurt (Main) Hbf',
                                    },
                                    departure: '2024-01-15T10:00:00Z',
                                    plannedDeparture: '2024-01-15T10:00:00Z',
                                    arrival: null,
                                    plannedArrival: '2024-01-15T14:00:00Z',
                                    line: { name: 'ICE 123' },
                                    departureDelay: 5,
                                    departurePlatform: '10',
                                    arrivalPlatform: '3',
                                },
                            ],
                        },
                    ],
                }
            )

            const result = await getConnections('8011160', '8000105', 2)

            expect(result).toHaveLength(1)
            expect(result[0]).toMatchObject({
                departure: '2024-01-15T10:00:00Z',
                arrival: '2024-01-15T14:00:00Z',
                departureStation: 'Berlin Hbf',
                arrivalStation: 'Frankfurt (Main) Hbf',
                departurePlatform: '10',
                arrivalPlatform: '3',
                delay: 5,
                duration: 240,
            })
            expect(result[0].legs).toHaveLength(1)
            expect(result[0].legs[0]).toMatchObject({
                line: 'ICE 123',
                walking: false,
                cancelled: false,
                duration: 240,
            })
        })

        it('marks walking and cancelled legs correctly and skips journeys with no legs', async () => {
            vi.spyOn(externalFetchUtils, 'externalFetchJson').mockResolvedValue(
                {
                    journeys: [
                        { legs: [] },
                        {
                            legs: [
                                {
                                    origin: { name: 'A' },
                                    destination: { name: 'B' },
                                    departure: '2024-01-15T10:00:00Z',
                                    plannedDeparture: '2024-01-15T10:00:00Z',
                                    arrival: '2024-01-15T10:10:00Z',
                                    plannedArrival: '2024-01-15T10:10:00Z',
                                    walking: true,
                                },
                                {
                                    origin: { name: 'B' },
                                    destination: { name: 'C' },
                                    departure: '2024-01-15T10:20:00Z',
                                    plannedDeparture: '2024-01-15T10:20:00Z',
                                    arrival: '2024-01-15T11:00:00Z',
                                    plannedArrival: '2024-01-15T11:00:00Z',
                                    cancelled: true,
                                },
                            ],
                        },
                    ],
                }
            )

            const result = await getConnections('A', 'C')

            expect(result).toHaveLength(1)
            expect(result[0].legs[0].walking).toBe(true)
            expect(result[0].legs[1].cancelled).toBe(true)
        })
    })
})
