import { useCallback, useEffect, useState } from 'react'
import * as googleAuth from '../services/googleAuth'

export const useGoogleAuth = () => {
    const [isSignedIn, setIsSignedIn] = useState(googleAuth.isSignedIn())
    const [isSigningIn, setIsSigningIn] = useState(false)
    const [error, setError] = useState<string | undefined>(undefined)

    useEffect(
        () =>
            googleAuth.subscribe(() => setIsSignedIn(googleAuth.isSignedIn())),
        []
    )

    const signIn = useCallback(async () => {
        setIsSigningIn(true)
        setError(undefined)
        try {
            await googleAuth.signIn()
        } catch (err) {
            setError(
                err instanceof Error ? err.message : 'Google sign-in failed'
            )
        } finally {
            setIsSigningIn(false)
        }
    }, [])

    const signOut = useCallback(() => {
        googleAuth.signOut()
    }, [])

    return { isSignedIn, isSigningIn, error, signIn, signOut }
}
