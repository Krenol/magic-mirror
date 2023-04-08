import passport from "passport";
import { Strategy, VerifyCallback } from "passport-google-oauth2";
import { GOOGLE_AUTH_STRATEGY_OPTIONS } from "config/auth";
import { GoogleUser } from "models/api/express_user";
import { DtoUser, IDtoUser } from "models/mongo/users";
import { DtoAllowedUserEmail } from "models/mongo/allowed_user_emails";
import { LOGGER } from "services/loggers";

var refresh = require('passport-oauth2-refresh')


export const setupPassportAuthentication = () => {
    LOGGER.info("Setup passport strategy");
    const strategy = new Strategy(GOOGLE_AUTH_STRATEGY_OPTIONS, authenticateUser);
    passport.use('google-login', strategy);
    passport.serializeUser((user: Express.User, done: (err: any, id?: unknown) => void) => {
        done(null, (user as GoogleUser).sub)
    })
    passport.deserializeUser((id: string, done: (err: any, user?: false | Express.User | null | undefined) => void) => {
        DtoUser.findOne({ sub: id })
            .then(user => done(null, user))
            .catch(err => done(err, null))
    })
    refresh.use(strategy)
}

const authenticateUser = (request: any, accessToken: any, refreshToken: any, profile: any, done: VerifyCallback) => {
    DtoUser.findOne({ sub: profile.sub })
        .then(user => {
            if (!user) {
                handleNewUser(profile, accessToken, refreshToken, done)
            } else {
                handleFoundUser(user, accessToken, refreshToken, done);
            }
        })
        .catch(err => {
            LOGGER.error(err.message);
            done(err, null);
        })
}

const handleNewUser = (profile: any, accessToken: any, refreshToken: any, done: VerifyCallback) => {
    checkIfAuthorizedNewUser(profile.email)
        .then(() => createNewUserDto(profile, accessToken, refreshToken))
        .then(user => user.save())
        .then(u => {
            LOGGER.info(`New User ${profile.sub} registered with email ${profile.email}`);
            return u;
        })
        .then(u => done(null, u))
        .catch(err => done(err, null));
}

const checkIfAuthorizedNewUser = async (email: string) => {
    let count = await DtoAllowedUserEmail.count({ email }).exec();
    if (count > 0) return;
    throw new Error(`Unauthorized User with email ${email}`);
}

const createNewUserDto = async (profile: any, accessToken: any, refreshToken: any): Promise<IDtoUser> => {
    return new DtoUser({
        email: profile.email,
        sub: profile.sub,
        displayName: profile.displayName,
        refresh_token: refreshToken,
        access_token: accessToken
    });
}

const handleFoundUser = (user: IDtoUser, accessToken: any, refreshToken: any, done: VerifyCallback) => {
    user.refresh_token = refreshToken;
    user.access_token = accessToken;
    user.save()
        .then(u => {
            LOGGER.info(`User ${user.sub} signed in`);
            return u;
        })
        .then(u => done(null, u));
}