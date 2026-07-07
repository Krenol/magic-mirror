import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { useGetUserSettings, patchUserSettings } from '../../apis/user_settings'
import { ReactNode } from 'react'

describe('useGetUserSettings', () => {
    let queryClient: QueryClient

    beforeEach(() => {
        window.localStorage.clear()
        queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false,
                    cacheTime: 0,
                },
            },
        })
    })

    afterEach(() => {
        window.localStorage.clear()
    })

    const wrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )

    const mockUserSettings = {
        country: 'Germany',
        city: 'Berlin',
        zip_code: '10115',
        birthday_cal_id: 'cal_123',
        events_cal_id: 'cal_456',
    }

    it('should return settings stored in localStorage', async () => {
        window.localStorage.setItem(
            'magic-mirror.user-settings',
            JSON.stringify(mockUserSettings)
        )

        const { result } = renderHook(() => useGetUserSettings(), { wrapper })

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true)
        })

        expect(result.current.data).toEqual(mockUserSettings)
    })

    it('should resolve to an empty object when nothing is stored yet', async () => {
        const { result } = renderHook(() => useGetUserSettings(), { wrapper })

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true)
        })

        expect(result.current.data).toEqual({})
    })

    it('should not refetch on interval', async () => {
        window.localStorage.setItem(
            'magic-mirror.user-settings',
            JSON.stringify(mockUserSettings)
        )

        const { result } = renderHook(() => useGetUserSettings(), { wrapper })

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true)
        })

        await new Promise((resolve) => setTimeout(resolve, 100))

        expect(result.current.data).toEqual(mockUserSettings)
    })
})

describe('patchUserSettings', () => {
    beforeEach(() => {
        window.localStorage.clear()
    })

    afterEach(() => {
        window.localStorage.clear()
    })

    it('merges the patch into any existing stored settings', async () => {
        window.localStorage.setItem(
            'magic-mirror.user-settings',
            JSON.stringify({ country: 'Germany', city: 'Berlin' })
        )

        const result = await patchUserSettings({ city: 'Munich' })

        expect(result).toEqual({ country: 'Germany', city: 'Munich' })
        expect(
            JSON.parse(
                window.localStorage.getItem('magic-mirror.user-settings')!
            )
        ).toEqual({ country: 'Germany', city: 'Munich' })
    })

    it('creates a new entry when nothing was stored before', async () => {
        const result = await patchUserSettings({ country: 'Germany' })

        expect(result).toEqual({ country: 'Germany' })
    })
})
