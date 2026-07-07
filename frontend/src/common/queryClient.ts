import { QueryClient } from 'react-query'

// A single shared QueryClient instance so plain (non-hook) functions like
// patchUserSettings/putUserSettings can update the cache after writing to
// localStorage, in addition to the QueryClientProvider used by the app tree.
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: true,
            retry: 2,
            retryDelay: 300,
            staleTime: 60000,
        },
    },
})
