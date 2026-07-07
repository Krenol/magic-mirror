import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { useGetGeocode } from '../../apis/geocode'
import * as externalFetchUtils from '../../common/externalFetch'
import { ReactNode } from 'react'

describe('useGetGeocode', () => {
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

    const mockGeocodeResponse = [
        { lat: '52.52', lon: '13.405', importance: 0.8 },
    ]

    it('should fetch geocode successfully', async () => {
        vi.spyOn(externalFetchUtils, 'externalFetchJson').mockResolvedValue(
            mockGeocodeResponse
        )

        const { result } = renderHook(
            () => useGetGeocode('test-key', 'Germany', 'Berlin', '10115', true),
            { wrapper }
        )

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true)
        })

        expect(result.current.data).toEqual({
            longitude: 13.405,
            latitude: 52.52,
        })
        expect(externalFetchUtils.externalFetchJson).toHaveBeenCalledWith(
            expect.stringContaining('geocode.maps.co')
        )
        expect(externalFetchUtils.externalFetchJson).toHaveBeenCalledWith(
            expect.stringContaining('api_key=test-key')
        )
    })

    it('should be disabled when enabled is false', () => {
        vi.spyOn(externalFetchUtils, 'externalFetchJson').mockResolvedValue([])

        const { result } = renderHook(
            () =>
                useGetGeocode('test-key', 'Germany', 'Berlin', '10115', false),
            { wrapper }
        )

        expect(result.current.isLoading).toBe(false)
        expect(externalFetchUtils.externalFetchJson).not.toHaveBeenCalled()
    })

    it('should handle fetch errors', async () => {
        const mockError = new Error('Geocode API error')
        vi.spyOn(externalFetchUtils, 'externalFetchJson').mockRejectedValue(
            mockError
        )

        const { result } = renderHook(
            () => useGetGeocode('test-key', 'Germany', 'Berlin', '10115', true),
            { wrapper }
        )

        await waitFor(() => {
            expect(result.current.isError).toBe(true)
        })

        expect(result.current.error).toEqual(mockError)
    })

    it('should use default parameters and be enabled by default', async () => {
        vi.spyOn(externalFetchUtils, 'externalFetchJson').mockResolvedValue(
            mockGeocodeResponse
        )

        const { result } = renderHook(() => useGetGeocode('test-key'), {
            wrapper,
        })

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true)
        })
    })
})
