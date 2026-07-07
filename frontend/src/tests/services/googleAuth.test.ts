import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as googleAuth from '../../services/googleAuth'

describe('googleAuth', () => {
    let capturedCallback: ((response: GoogleTokenResponse) => void) | undefined

    // googleAuth.ts caches the GIS token client (and the client object it
    // returns) after the first successful init, so these mock function
    // *references* must stay stable across tests within this file - only
    // their behavior is reset per test via mockReset/mockImplementation.
    const requestAccessTokenMock = vi.fn()
    const revokeMock = vi.fn((_token: string, callback: () => void) =>
        callback()
    )
    const initTokenClientMock = vi.fn(
        (config: { callback: typeof capturedCallback }) => {
            capturedCallback = config.callback
            return { requestAccessToken: requestAccessTokenMock }
        }
    )

    beforeEach(() => {
        window.sessionStorage.clear()

        requestAccessTokenMock.mockReset()
        requestAccessTokenMock.mockImplementation(() => {
            capturedCallback?.({
                access_token: 'mock-access-token',
                expires_in: 3600,
            })
        })
        revokeMock.mockClear()

        window.google = {
            accounts: {
                oauth2: {
                    initTokenClient: initTokenClientMock,
                    revoke: revokeMock,
                },
            },
        }
    })

    it('is not signed in before any sign-in attempt', () => {
        expect(googleAuth.isSignedIn()).toBe(false)
    })

    it('signIn() requests a token with the consent prompt and stores it', async () => {
        await googleAuth.signIn()

        expect(requestAccessTokenMock).toHaveBeenCalledWith({
            prompt: 'consent',
        })
        expect(googleAuth.isSignedIn()).toBe(true)
    })

    it('signIn() throws and does not mark as signed in when GIS returns an error', async () => {
        requestAccessTokenMock.mockImplementation(() => {
            capturedCallback?.({ error: 'access_denied' })
        })

        await expect(googleAuth.signIn()).rejects.toThrow('access_denied')
        expect(googleAuth.isSignedIn()).toBe(false)
    })

    it('getAccessToken() returns the cached token without a fresh request once signed in', async () => {
        await googleAuth.signIn()
        requestAccessTokenMock.mockClear()

        const token = await googleAuth.getAccessToken()

        expect(token).toBe('mock-access-token')
        expect(requestAccessTokenMock).not.toHaveBeenCalled()
    })

    it('getAccessToken() returns null when never signed in', async () => {
        const token = await googleAuth.getAccessToken()
        expect(token).toBeNull()
    })

    it('signOut() revokes the token and clears sign-in state', async () => {
        await googleAuth.signIn()

        googleAuth.signOut()

        expect(revokeMock).toHaveBeenCalledWith(
            'mock-access-token',
            expect.any(Function)
        )
        expect(googleAuth.isSignedIn()).toBe(false)
    })

    it('notifies subscribers when sign-in state changes', async () => {
        const listener = vi.fn()
        const unsubscribe = googleAuth.subscribe(listener)

        await googleAuth.signIn()

        expect(listener).toHaveBeenCalled()
        unsubscribe()
    })
})
