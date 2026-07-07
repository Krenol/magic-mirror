import { useQuery, UseQueryResult } from 'react-query'
import { ServerStateKeysEnum } from '../common/statekeys'
import { REFETCH_INTERVAL } from '../constants/api'
import { BIRTHDAY_COUNT } from '../constants/events'
import { BirthdayList } from '../models/birthdays'
import { getAccessToken } from '../services/googleAuth'
import { getBirthdays } from '../services/googleCalendar'
import { useGoogleAuth } from '../hooks/useGoogleAuth'

export const useGetBirthdays = (
    calendar_id: string,
    birthday_count: number = BIRTHDAY_COUNT
): UseQueryResult<BirthdayList, Error> => {
    const { isSignedIn } = useGoogleAuth()

    return useQuery<BirthdayList, Error>({
        queryKey: [ServerStateKeysEnum.birthdays, birthday_count, calendar_id],
        queryFn: async (): Promise<BirthdayList> => {
            const accessToken = await getAccessToken()
            if (!accessToken) {
                throw new Error('Not signed in with Google')
            }
            return getBirthdays(accessToken, calendar_id, birthday_count)
        },
        refetchInterval: REFETCH_INTERVAL,
        enabled: isSignedIn,
    })
}
