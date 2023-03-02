import { GOOGLE_API_HOST, GOOGLE_OAUTH_API_HOST } from "./google";
import { OPENWEATHER_URL } from "./icon_api";
import { WEATHER_API_URL } from "./openmeteo_api";

export const ALLOWED_URLS = [
    GOOGLE_API_HOST,
    GOOGLE_OAUTH_API_HOST,
    WEATHER_API_URL,
    OPENWEATHER_URL
]

export const RATE_LIMIT = {
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 500
}