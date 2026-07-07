import { useQuery, useQueryClient } from 'react-query'
import { ServerStateKeysEnum } from '../common/statekeys'
import { getItem, setItem } from '../services/localStorage'

const STORAGE_KEY = 'magic-mirror.api-keys'

export type ApiKeys = {
    geocodeApiKey: string
    openWeatherMapApiKey: string
}

const EMPTY_API_KEYS: ApiKeys = {
    geocodeApiKey: '',
    openWeatherMapApiKey: '',
}

// Exported for callers that need a synchronous initial value (e.g. a
// useState initializer) without waiting a tick for react-query to resolve.
export const readApiKeys = (): ApiKeys => ({
    ...EMPTY_API_KEYS,
    ...getItem<Partial<ApiKeys>>(STORAGE_KEY),
})

export const useApiKeys = () => {
    const queryClient = useQueryClient()

    const query = useQuery<ApiKeys>({
        queryKey: [ServerStateKeysEnum.api_keys],
        queryFn: async () => readApiKeys(),
        refetchInterval: false,
        staleTime: Infinity,
    })

    const setApiKeys = (partial: Partial<ApiKeys>) => {
        const updated = { ...(query.data ?? readApiKeys()), ...partial }
        setItem(STORAGE_KEY, updated)
        queryClient.setQueryData([ServerStateKeysEnum.api_keys], updated)
    }

    return {
        apiKeys: query.data ?? EMPTY_API_KEYS,
        isLoading: query.isLoading,
        setApiKeys,
    }
}
