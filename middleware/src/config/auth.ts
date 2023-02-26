export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost"
export const REDIRECT_URI = process.env.REDIRECT_URI || `${FRONTEND_URL}/`
export const FAILURE_REDIRECT_URI = process.env.FAILURE_REDIRECT_URI || `${FRONTEND_URL}/login`
export const GOOGLE_CALLBACK_CONTEXT = process.env.GOOGLE_CALLBACK_CONTEXT || "/auth/google/callback"