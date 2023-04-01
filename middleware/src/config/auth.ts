import { StrategyOptionsWithRequest } from "passport-google-oauth2";
import { OAUTH2_CLIENT } from "./google";
import { PROXY_SERVER_CONTEXT, PROXY_SERVER_HOSTNAME, PROXY_SERVER_PORT, PROXY_SERVER_PROTOCOL } from "./server";

export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost"
export const REDIRECT_URI = process.env.REDIRECT_URI || `${FRONTEND_URL}/`
export const FAILURE_REDIRECT_URI = process.env.FAILURE_REDIRECT_URI || `${FRONTEND_URL}/login`
export const GOOGLE_CALLBACK_CONTEXT = process.env.GOOGLE_CALLBACK_CONTEXT || "/auth/google/callback"
export const GOOGLE_AUTH_STRATEGY_OPTIONS: StrategyOptionsWithRequest = {
    clientID: OAUTH2_CLIENT.CLIENT_ID,
    clientSecret: OAUTH2_CLIENT.CLIENT_SECRET,
    callbackURL: `${PROXY_SERVER_PROTOCOL}://${PROXY_SERVER_HOSTNAME}:${PROXY_SERVER_PORT}${PROXY_SERVER_CONTEXT}/${GOOGLE_CALLBACK_CONTEXT.replace(RegExp('^/(.*)$'), '$1')}`,
    passReqToCallback: true
}
export const ALLOWED_USERS: Array<string> = JSON.parse(process.env.ALLOWED_USER_EMAILS || "[]")