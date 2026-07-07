import { createContext, useMemo, type ReactNode, memo } from 'react'
import { useGetUserSettings } from '../apis/user_settings'
import { useGetGeocode } from '../apis/geocode'
import { useApiKeys } from '../hooks/useApiKeys'

type LocationContextType = {
    longitude: number
    latitude: number
    isLoading: boolean
}

const defaultValue: LocationContextType = {
    longitude: 0,
    latitude: 0,
    isLoading: true,
}

const LocationContext = createContext<LocationContextType>(defaultValue)

interface LocationContextProviderProps {
    children: ReactNode
}

const LocationContextProviderComponent = ({
    children,
}: LocationContextProviderProps) => {
    const { data: userSettings, isLoading: isUserSettingLoading } =
        useGetUserSettings()
    const { apiKeys } = useApiKeys()

    const canGeocode = useMemo<boolean>(
        () =>
            !isUserSettingLoading &&
            !!userSettings?.city &&
            !!userSettings?.country &&
            !!userSettings?.zip_code &&
            !!apiKeys.geocodeApiKey,
        [userSettings, isUserSettingLoading, apiKeys.geocodeApiKey]
    )

    const { data: apiGeoLocation, isLoading: isGeoCodeLoading } = useGetGeocode(
        apiKeys.geocodeApiKey,
        userSettings?.country,
        userSettings?.city,
        userSettings?.zip_code,
        canGeocode
    )

    const contextValue = useMemo<LocationContextType>(
        () => ({
            longitude: apiGeoLocation?.longitude ?? 0,
            latitude: apiGeoLocation?.latitude ?? 0,
            isLoading: isUserSettingLoading || isGeoCodeLoading,
        }),
        [
            apiGeoLocation?.longitude,
            apiGeoLocation?.latitude,
            isUserSettingLoading,
            isGeoCodeLoading,
        ]
    )

    return (
        <LocationContext.Provider value={contextValue}>
            {children}
        </LocationContext.Provider>
    )
}

const LocationContextProvider = memo(LocationContextProviderComponent)
LocationContextProvider.displayName = 'LocationContextProvider'

export { LocationContext, LocationContextProvider }
export type { LocationContextType }
