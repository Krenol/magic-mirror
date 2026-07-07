import { GOOGLE_CLIENT_ID, GOOGLE_CALENDAR_SCOPE } from '../constants/google'

const TOKEN_STORAGE_KEY = 'magic-mirror.google-token'
// Refresh a little before actual expiry so a request never races an
// about-to-expire token.
const EXPIRY_SAFETY_MARGIN_MS = 60000
const GIS_LOAD_TIMEOUT_MS = 10000

type StoredToken = {
    accessToken: string
    expiresAt: number
}

let tokenClient: GoogleTokenClient | undefined
let initPromise: Promise<GoogleTokenClient> | undefined
let pendingResolve: ((response: GoogleTokenResponse) => void) | undefined

const listeners = new Set<() => void>()

// Lets React components (via useGoogleAuth) re-render when sign-in state
// changes, since this module lives outside the React tree.
export const subscribe = (listener: () => void): (() => void) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
}

const notify = (): void => listeners.forEach((listener) => listener())

const readStoredToken = (): StoredToken | undefined => {
    try {
        const raw = window.sessionStorage.getItem(TOKEN_STORAGE_KEY)
        return raw ? (JSON.parse(raw) as StoredToken) : undefined
    } catch {
        return undefined
    }
}

const storeToken = (token: StoredToken | undefined): void => {
    try {
        if (token) {
            window.sessionStorage.setItem(
                TOKEN_STORAGE_KEY,
                JSON.stringify(token)
            )
        } else {
            window.sessionStorage.removeItem(TOKEN_STORAGE_KEY)
        }
    } catch {
        // ignore storage failures (private browsing, quota, etc.)
    }
    notify()
}

const isValid = (token: StoredToken | undefined): token is StoredToken =>
    !!token && token.expiresAt - EXPIRY_SAFETY_MARGIN_MS > Date.now()

export const isSignedIn = (): boolean => isValid(readStoredToken())

const waitForGis = (): Promise<void> =>
    new Promise((resolve, reject) => {
        const start = Date.now()
        const check = () => {
            if (window.google?.accounts?.oauth2) {
                resolve()
            } else if (Date.now() - start > GIS_LOAD_TIMEOUT_MS) {
                reject(new Error('Google Identity Services failed to load'))
            } else {
                setTimeout(check, 100)
            }
        }
        check()
    })

const getTokenClient = async (): Promise<GoogleTokenClient> => {
    if (tokenClient) return tokenClient
    if (!initPromise) {
        initPromise = waitForGis().then(() => {
            tokenClient = window.google!.accounts.oauth2.initTokenClient({
                client_id: GOOGLE_CLIENT_ID,
                scope: GOOGLE_CALENDAR_SCOPE,
                callback: (response) => {
                    pendingResolve?.(response)
                    pendingResolve = undefined
                },
            })
            return tokenClient
        })
    }
    return initPromise
}

const requestToken = async (prompt: string): Promise<GoogleTokenResponse> => {
    const client = await getTokenClient()
    return new Promise((resolve) => {
        pendingResolve = resolve
        client.requestAccessToken({ prompt })
    })
}

const storeTokenResponse = (response: GoogleTokenResponse): string => {
    if (response.error || !response.access_token) {
        throw new Error(response.error ?? 'Google sign-in failed')
    }
    const token: StoredToken = {
        accessToken: response.access_token,
        expiresAt: Date.now() + (response.expires_in ?? 3600) * 1000,
    }
    storeToken(token)
    return token.accessToken
}

export const signIn = async (): Promise<void> => {
    const response = await requestToken('consent')
    storeTokenResponse(response)
}

export const signOut = (): void => {
    const token = readStoredToken()
    if (token && window.google?.accounts?.oauth2) {
        window.google.accounts.oauth2.revoke(token.accessToken, () => {})
    }
    storeToken(undefined)
}

// Returns a usable access token, silently refreshing an expired one if we've
// signed in before, or null if the user isn't signed in / silent refresh
// fails (e.g. no live Google session, or the browser blocked GIS's
// third-party refresh mechanism - see the kiosk-browser caveat in the plan).
export const getAccessToken = async (): Promise<string | null> => {
    const token = readStoredToken()
    if (isValid(token)) {
        return token.accessToken
    }
    if (!token) {
        return null
    }
    try {
        const response = await requestToken('')
        return storeTokenResponse(response)
    } catch {
        storeToken(undefined)
        return null
    }
}
