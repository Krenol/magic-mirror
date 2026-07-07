import { useQuery } from 'react-query'
import { ServerStateKeysEnum } from '../common/statekeys'
import { GeoLocation } from '../models/location'
import { getGeocode } from '../services/geocode'

export const useGetGeocode = (
    apiKey: string,
    country?: string,
    city?: string,
    zipCode?: string,
    enabled: boolean = true
) => {
    return useQuery<GeoLocation, Error>({
        queryKey: [ServerStateKeysEnum.geocode, apiKey, country, city, zipCode],
        queryFn: async () => getGeocode(country ?? '', apiKey, city, zipCode),
        refetchInterval: false,
        enabled,
    })
}
