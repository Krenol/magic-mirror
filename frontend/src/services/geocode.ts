import { externalFetchJson } from '../common/externalFetch'
import { GeoLocation } from '../models/location'

export const GEOCODE_URL = 'https://geocode.maps.co'

type GeocodeResult = {
    lat: string
    lon: string
    importance: number
}

const buildGeocodeUrl = (
    country: string,
    apiKey: string,
    city?: string,
    zipCode?: string
): string => {
    const params = new URLSearchParams({
        country,
        api_key: apiKey,
    })
    if (zipCode) {
        params.append('postalcode', zipCode)
    }
    if (city) {
        params.append('city', city)
    }
    return `${GEOCODE_URL}/search?${params.toString()}`
}

const parseGeocodeResponse = (results: GeocodeResult[]): GeoLocation => {
    if (!Array.isArray(results) || results.length === 0) {
        throw new Error('Geolocation could not be found')
    }
    const mostImportantResult = results.reduce((prev, current) =>
        current.importance > prev.importance ? current : prev
    )
    return {
        longitude: parseFloat(mostImportantResult.lon),
        latitude: parseFloat(mostImportantResult.lat),
    }
}

export const getGeocode = async (
    country: string,
    apiKey: string,
    city?: string,
    zipCode?: string
): Promise<GeoLocation> => {
    const results = await externalFetchJson<GeocodeResult[]>(
        buildGeocodeUrl(country, apiKey, city, zipCode)
    )
    return parseGeocodeResponse(results)
}
