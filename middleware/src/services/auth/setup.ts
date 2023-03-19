import passport from "passport";
import { Express } from "express";
import { Strategy, VerifyCallback } from "passport-google-oauth2";
import { OAUTH2_CLIENT } from "../../config/google";
import { PROXY_SERVER_CONTEXT, PROXY_SERVER_HOSTNAME, PROXY_SERVER_PORT, PROXY_SERVER_PROTOCOL } from "../../config/server";
import { LOGGER } from "../loggers";
import { GOOGLE_CALLBACK_CONTEXT } from "../../config/auth";

const regex = RegExp('^/(.*)$')

export const setupPassport = (app: Express) => {
    app.use(passport.initialize());
    app.use(passport.session());
    initPassport();
}

const initPassport = () => {
    const strategy = new Strategy({
        clientID: OAUTH2_CLIENT.CLIENT_ID,
        clientSecret: OAUTH2_CLIENT.CLIENT_SECRET,
        callbackURL: `${PROXY_SERVER_PROTOCOL}://${PROXY_SERVER_HOSTNAME}:${PROXY_SERVER_PORT}${PROXY_SERVER_CONTEXT}/${GOOGLE_CALLBACK_CONTEXT.replace(regex, '$1')}`,
        passReqToCallback: true
    }, authenticateUser);
    passport.use(strategy)
    passport.serializeUser((user: Express.User, done: (err: any, id?: unknown) => void) => {
        done(null, user)
    })
    passport.deserializeUser((user: Express.User, done: (err: any, user?: false | Express.User | null | undefined) => void) => {
        done(null, user)
    })
}

const authenticateUser = (request: any, accessToken: any, refreshToken: any, profile: any, done: VerifyCallback) => {
    LOGGER.info(`User ${profile.displayName} signed in`);
    LOGGER.info(accessToken)
    profile.access_token = accessToken;
    profile.refresh_token = refreshToken;
    return done(null, profile);
}
