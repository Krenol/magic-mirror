import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { useGetCurrentWeather } from '../../apis/current_weather'
import * as externalFetchUtils from '../../common/externalFetch'
import { ReactNode } from 'react'

describe('useGetCurrentWeather', () => {
    let queryClient: QueryClient

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false,
                    cacheTime: 0,
                },
            },
        })
        vi.clearAllMocks()
    })

    const wrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )

    const mockOpenMeteoResponse = {
        latitude: 52.52,
        longitude: 13.405,
        daily: {
            sunrise: ['2024-01-15T07:00'],
            sunset: ['2024-01-15T17:00'],
            temperature_2m_min: [15],
            temperature_2m_max: [25],
            precipitation_sum: [0],
        },
        daily_units: {
            precipitation_sum: 'mm',
        },
        hourly: {
            apparent_temperature: Array(24).fill(19),
        },
        current_weather: {
            time: '2024-01-15T12:00',
            temperature: 20,
            windspeed: 10,
            weathercode: 1,
        },
        current_weather_units: {
            temperature: '°C',
            windspeed: 'km/h',
        },
    }

    it('should fetch current weather successfully', async () => {
        vi.spyOn(externalFetchUtils, 'externalFetchJson').mockResolvedValue(
            mockOpenMeteoResponse
        )

        const { result } = renderHook(
            () => useGetCurrentWeather(13.405, 52.52, true, 'Europe/Berlin'),
            { wrapper }
        )

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true)
        })

        expect(result.current.data?.latitude).toEqual(52.52)
        expect(result.current.data?.temperature.current).toEqual(20)
        expect(externalFetchUtils.externalFetchJson).toHaveBeenCalledWith(
            expect.stringContaining('api.open-meteo.com')
        )
        expect(externalFetchUtils.externalFetchJson).toHaveBeenCalledWith(
            expect.stringContaining('latitude=52.52')
        )
        expect(externalFetchUtils.externalFetchJson).toHaveBeenCalledWith(
            expect.stringContaining('longitude=13.405')
        )
        expect(externalFetchUtils.externalFetchJson).toHaveBeenCalledWith(
            expect.stringContaining('timezone=Europe%2FBerlin')
        )
    })

    it('should use default parameters when not provided', async () => {
        vi.spyOn(externalFetchUtils, 'externalFetchJson').mockResolvedValue(
            mockOpenMeteoResponse
        )

        const { result } = renderHook(() => useGetCurrentWeather(), { wrapper })

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true)
        })

        expect(externalFetchUtils.externalFetchJson).toHaveBeenCalledWith(
            expect.stringContaining('timezone=GMT')
        )
    })

    it('should be disabled when enabled is false', () => {
        vi.spyOn(externalFetchUtils, 'externalFetchJson').mockResolvedValue(
            mockOpenMeteoResponse
        )

        const { result } = renderHook(
            () => useGetCurrentWeather(13.405, 52.52, false, 'Europe/Berlin'),
            { wrapper }
        )

        expect(result.current.isLoading).toBe(false)
        expect(externalFetchUtils.externalFetchJson).not.toHaveBeenCalled()
    })

    it('should handle fetch errors', async () => {
        const mockError = new Error('Weather API error')
        vi.spyOn(externalFetchUtils, 'externalFetchJson').mockRejectedValue(
            mockError
        )

        const { result } = renderHook(
            () => useGetCurrentWeather(13.405, 52.52, true, 'Europe/Berlin'),
            { wrapper }
        )

        await waitFor(() => {
            expect(result.current.isError).toBe(true)
        })

        expect(result.current.error).toEqual(mockError)
    })

    it('should configure refetch interval', async () => {
        const fetchSpy = vi
            .spyOn(externalFetchUtils, 'externalFetchJson')
            .mockResolvedValue(mockOpenMeteoResponse)

        const { result } = renderHook(
            () => useGetCurrentWeather(13.405, 52.52, true, 'Europe/Berlin'),
            { wrapper }
        )

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true)
        })

        expect(fetchSpy).toHaveBeenCalledTimes(1)
    })

    it('should fetch independently for different parameters', async () => {
        vi.spyOn(externalFetchUtils, 'externalFetchJson').mockResolvedValue(
            mockOpenMeteoResponse
        )

        const { result: result1 } = renderHook(
            () => useGetCurrentWeather(13.405, 52.52, true, 'Europe/Berlin'),
            { wrapper }
        )

        await waitFor(() => {
            expect(result1.current.isSuccess).toBe(true)
        })

        // Should fetch with correct parameters
        expect(externalFetchUtils.externalFetchJson).toHaveBeenCalledTimes(1)
    })
})
