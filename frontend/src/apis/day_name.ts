import { useQuery } from 'react-query'
import { getDayName } from '../common/dateParser'
import { ServerStateKeysEnum } from '../common/statekeys'
import { DEFAULT_LOCALE } from '../constants/defaults'
import { WeekdayFormat } from '../models/time'

export const useGetDayName = (
    date: Date,
    locale: string = DEFAULT_LOCALE,
    weekdayFormat: WeekdayFormat = 'short'
) =>
    useQuery<string, Error>({
        queryKey: [ServerStateKeysEnum.time, date, locale, weekdayFormat],
        queryFn: async () => getDayName(date, locale, weekdayFormat),
    })
