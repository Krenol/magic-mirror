import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { useGetBirthdays } from '../../apis/birthday'
import * as googleAuth from '../../services/googleAuth'
import * as googleCalendar from '../../services/googleCalendar'
import { ReactNode } from 'react'

describe('useGetBirthdays', () => {
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
        vi.spyOn(googleAuth, 'isSignedIn').mockReturnValue(true)
        vi.spyOn(googleAuth, 'getAccessToken').mockResolvedValue('fake-token')
    })

    const wrapper = ({ children }: { children: ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )

    const mockBirthdays = {
        count: 2,
        list: [
            { name: 'John Doe', date: '2024-01-20' },
            { name: 'Jane Smith', date: '2024-01-25' },
        ],
    }

    it('should fetch birthdays successfully', async () => {
        const getBirthdaysSpy = vi
            .spyOn(googleCalendar, 'getBirthdays')
            .mockResolvedValue(mockBirthdays)

        const { result } = renderHook(() => useGetBirthdays('cal_123', 5), {
            wrapper,
        })

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true)
        })

        expect(result.current.data).toEqual(mockBirthdays)
        expect(getBirthdaysSpy).toHaveBeenCalledWith('fake-token', 'cal_123', 5)
    })

    it('should use default birthday count when not provided', async () => {
        const getBirthdaysSpy = vi
            .spyOn(googleCalendar, 'getBirthdays')
            .mockResolvedValue({ count: 0, list: [] })

        const { result } = renderHook(() => useGetBirthdays('cal_123'), {
            wrapper,
        })

        await waitFor(() => {
            expect(result.current.isSuccess).toBe(true)
        })

        expect(getBirthdaysSpy).toHaveBeenCalledWith(
            'fake-token',
            'cal_123',
            expect.any(Number)
        )
    })

    it('should not fetch when not signed in with Google', () => {
        vi.spyOn(googleAuth, 'isSignedIn').mockReturnValue(false)
        const getBirthdaysSpy = vi.spyOn(googleCalendar, 'getBirthdays')

        const { result } = renderHook(() => useGetBirthdays('cal_123', 5), {
            wrapper,
        })

        expect(result.current.isLoading).toBe(false)
        expect(getBirthdaysSpy).not.toHaveBeenCalled()
    })

    it('should handle fetch errors', async () => {
        const mockError = new Error('Birthdays API error')
        vi.spyOn(googleCalendar, 'getBirthdays').mockRejectedValue(mockError)

        const { result } = renderHook(() => useGetBirthdays('cal_123', 5), {
            wrapper,
        })

        await waitFor(() => {
            expect(result.current.isError).toBe(true)
        })

        expect(result.current.error).toEqual(mockError)
    })

    it('should have unique query keys for different parameters', async () => {
        vi.spyOn(googleCalendar, 'getBirthdays').mockResolvedValue({
            count: 0,
            list: [],
        })

        const { result: result1 } = renderHook(
            () => useGetBirthdays('cal_123', 5),
            { wrapper }
        )
        const { result: result2 } = renderHook(
            () => useGetBirthdays('cal_456', 10),
            { wrapper }
        )

        await waitFor(() => {
            expect(result1.current.isSuccess).toBe(true)
            expect(result2.current.isSuccess).toBe(true)
        })

        expect(googleCalendar.getBirthdays).toHaveBeenCalledTimes(2)
    })
})
