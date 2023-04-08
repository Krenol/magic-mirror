import { GOOGLE_API_HOST, GOOGLE_OAUTH_API_HOST } from "config/google";
import { OPENWEATHER_URL } from "config/icon_api";
import { WEATHER_API_URL } from "config/openmeteo_api";

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