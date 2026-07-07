// The Google OAuth Client ID is not a secret (it's meant to be public/bundled
// client-side) - this is the same Client ID previously configured for
// oauth2-proxy's server-side flow. It also needs "Authorized JavaScript
// origins" configured in Google Cloud Console for the origin(s) this app is
// served from, which Google Identity Services (GIS) requires for the
// browser-side token flow used here.
export const GOOGLE_CLIENT_ID =
    import.meta.env.VITE_GOOGLE_CLIENT_ID ??
    '428211582851-66891ucq97qkrbmsik41ftkfcke0u26f.apps.googleusercontent.com'

export const GOOGLE_CALENDAR_SCOPE =
    'https://www.googleapis.com/auth/calendar.readonly'
