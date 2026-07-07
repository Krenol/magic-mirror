// Minimal typing for the subset of Google Identity Services (GIS) used by
// services/googleAuth.ts. GIS is loaded via a <script> tag (see index.html),
// not an npm package, so there's no upstream type definition to depend on.
export {}

declare global {
    interface Window {
        google?: {
            accounts: {
                oauth2: {
                    initTokenClient: (config: {
                        client_id: string
                        scope: string
                        callback: (response: GoogleTokenResponse) => void
                    }) => GoogleTokenClient
                    revoke: (accessToken: string, callback: () => void) => void
                }
            }
        }
    }

    interface GoogleTokenClient {
        requestAccessToken: (overrideConfig?: { prompt?: string }) => void
    }

    interface GoogleTokenResponse {
        access_token?: string
        expires_in?: number
        error?: string
    }
}
