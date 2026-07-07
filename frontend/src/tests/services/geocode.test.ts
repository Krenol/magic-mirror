import { describe, it, expect, vi, afterEach } from 'vitest'
import * as externalFetchUtils from '../../common/externalFetch'
import { getGeocode } from '../../services/geocode'

describe('geocode', () => {
    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('picks the result with the highest importance', async () => {
        vi.spyOn(externalFetchUtils, 'externalFetchJson').mockResolvedValue([
            { lat: '10', lon: '20', importance: 0.3 },
            { lat: '52.52', lon: '13.405', importance: 0.9 },
            { lat: '30', lon: '40', importance: 0.5 },
        ])

        const result = await getGeocode('DE', 'test-key', 'Berlin', '10115')

        expect(result).toEqual({ longitude: 13.405, latitude: 52.52 })
    })

    it('throws when no results are returned', async () => {
        vi.spyOn(externalFetchUtils, 'externalFetchJson').mockResolvedValue([])

        await expect(getGeocode('DE', 'test-key')).rejects.toThrow(
            'Geolocation could not be found'
        )
    })

    it('builds the request url with country, api key, city and postal code', async () => {
        const spy = vi
            .spyOn(externalFetchUtils, 'externalFetchJson')
            .mockResolvedValue([{ lat: '1', lon: '2', importance: 1 }])

        await getGeocode('DE', 'my-key', 'Berlin', '10115')

        const calledUrl = spy.mock.calls[0][0] as string
        expect(calledUrl).toContain('geocode.maps.co/search')
        expect(calledUrl).toContain('country=DE')
        expect(calledUrl).toContain('api_key=my-key')
        expect(calledUrl).toContain('city=Berlin')
        expect(calledUrl).toContain('postalcode=10115')
    })
})
