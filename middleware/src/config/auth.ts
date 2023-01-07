export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000"
export const REDIRECT_URI = process.env.REDIRECT_URI || `${FRONTEND_URL}/`
export const FAILURE_REDIRECT_URI = process.env.FAILURE_REDIRECT_URI || `${FRONTEND_URL}/login`