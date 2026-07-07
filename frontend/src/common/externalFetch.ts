// Like ./fetch.ts, but without `credentials: 'include'`. Third-party APIs
// (Open-Meteo, geocode.maps.co, db.transport.rest, googleapis.com) generally
// respond to CORS with a wildcard/non-credentialed origin, and a credentialed
// request against such a response is blocked outright by the browser.

export const externalFetchJson = async <T>(
    url: string,
    options: RequestInit = {},
    allowed_status_codes: number[] = [200],
    retries: number = 1
): Promise<T> => {
    const response = await externalFetchRetry(
        url,
        options,
        allowed_status_codes,
        retries
    )
    return response.json() as Promise<T>
}

// https://dev.to/ycmjason/javascript-fetch-retry-upon-failure-3p6g
export const externalFetchRetry = async (
    url: string,
    options: RequestInit = {},
    allowed_status_codes: number[] = [200],
    retries: number = 1
): Promise<Response> => {
    try {
        const response = await fetch(url, options)
        return checkHttpStatusCode(response, allowed_status_codes, url)
    } catch (err) {
        if (retries <= 1) throw err
        return externalFetchRetry(
            url,
            options,
            allowed_status_codes,
            retries - 1
        )
    }
}

const checkHttpStatusCode = (
    response: Response,
    allowed_status_codes: number[],
    url?: string
): Response => {
    if (allowed_status_codes.includes(response.status)) {
        return response
    }
    throw Object.assign(
        new Error(
            `Request to ${url ?? 'URL'} failed with status code ${response.status}`
        ),
        { code: response.status }
    )
}
