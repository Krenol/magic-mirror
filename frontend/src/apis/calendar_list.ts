import { useQuery, UseQueryResult } from 'react-query'
import { ServerStateKeysEnum } from '../common/statekeys'
import { CalendarListItem } from '../models/calendar'
import { getAccessToken } from '../services/googleAuth'
import { getCalendarList } from '../services/googleCalendar'
import { useGoogleAuth } from '../hooks/useGoogleAuth'

export const useListCalendars = (
    enabled: boolean = true
): UseQueryResult<CalendarListItem[], Error> => {
    const { isSignedIn } = useGoogleAuth()

    return useQuery<CalendarListItem[], Error>({
        queryKey: [ServerStateKeysEnum.calendar_list],
        queryFn: async (): Promise<CalendarListItem[]> => {
            const accessToken = await getAccessToken()
            if (!accessToken) {
                throw new Error('Not signed in with Google')
            }
            return getCalendarList(accessToken)
        },
        refetchInterval: false,
        enabled: enabled && isSignedIn,
    })
}
