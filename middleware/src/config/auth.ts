import { FRONTEND_URL } from "./misc"

export const REDIRECT_URI = process.env.REDIRECT_URI || `${FRONTEND_URL}/`
export const FAILURE_REDIRECT_URI = process.env.FAILURE_REDIRECT_URI || `${FRONTEND_URL}/login`