import { useQuery, UseQueryResult } from 'react-query'
import { ServerStateKeysEnum } from '../common/statekeys'
import { queryClient } from '../common/queryClient'
import { UserSettings } from '../models/user_settings'
import { getItem, setItem } from '../services/localStorage'

const STORAGE_KEY = 'magic-mirror.user-settings'

const QUERY_KEY = [ServerStateKeysEnum.user_settings]

export const useGetUserSettings = (): UseQueryResult<UserSettings, Error> =>
    useQuery<UserSettings, Error>({
        queryKey: QUERY_KEY,
        // react-query warns if a queryFn resolves to `undefined`, so an
        // unconfigured (never-saved) settings object resolves to `{}`
        // instead - every consumer already reads fields via `?.`.
        queryFn: async (): Promise<UserSettings> =>
            getItem<UserSettings>(STORAGE_KEY) ?? ({} as UserSettings),
        refetchInterval: false,
    })

export const patchUserSettings = async (
    data: Partial<UserSettings>
): Promise<UserSettings> => {
    const existing = getItem<UserSettings>(STORAGE_KEY)
    const updated = { ...existing, ...data } as UserSettings
    setItem(STORAGE_KEY, updated)
    queryClient.setQueryData(QUERY_KEY, updated)
    return updated
}
