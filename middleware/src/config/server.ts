import { randomUUID } from "crypto"

export const SERVER_PORT = parseInt(process.env.PORT || String(3001));
export const SESSION_SECRET = process.env.SESSION_SECRET || randomUUID();
export const SERVER_HOSTNAME = process.env.SERVER_HOSTNAME || "localhost";
export const RATE_LIMIT = {
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 120
}