import passport from "passport";
import { GOOGLE_AUTH_STRATEGY_OPTIONS, LOGIN_STRATEGY_NAME } from "config";
import { DtoUser, IDtoUser } from "models/mongo/users";
import { DtoAllowedUserEmail } from "models/mongo/allowed_user_emails";
import { LOGGER } from "services/loggers";
import AuthTokenRefresh from "passport-oauth2-refresh"
import { Strategy, VerifyCallback } from "passport-google-oauth20";


export const setupPassportAuthentication = () => {
    LOGGER.info("Setup passport strategy");
    const strategy = new Strategy(GOOGLE_AUTH_STRATEGY_OPTIONS, authenticateUser);
    passport.use(LOGIN_STRATEGY_NAME, strategy);
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);
    AuthTokenRefresh.use(LOGIN_STRATEGY_NAME, strategy);
}

const authenticateUser = (request: any, accessToken: any, refreshToken: any, profile: any, done: VerifyCallback) => {
    DtoUser.findOne({ sub: profile._json.sub })
        .then(user => {
            if (!user) {
                handleNewUser(profile, accessToken, refreshToken, done)
            } else {
                handleFoundUser(user, accessToken, refreshToken, done);
            }
        })
        .catch(err => {
            LOGGER.error(err.message);
            done(err, undefined);
        })
}

const handleNewUser = (profile: any, accessToken: any, refreshToken: any, done: VerifyCallback) => {
    checkIfAuthorizedNewUser(profile._json.email)
        .then(() => createNewUserDto(profile, accessToken, refreshToken))
        .then(user => user.save())
        .then(u => {
            LOGGER.info(`New User ${profile._json.sub} registered with email ${profile._json.email}`);
            return u;
        })
        .then(u => done(null, u))
        .catch(err => done(err, undefined));
}

const checkIfAuthorizedNewUser = async (email: string) => {
    const count = await DtoAllowedUserEmail.count({ email }).exec();
    if (count > 0) return;
    throw new Error(`Unauthorized User with email ${email}`);
}

const createNewUserDto = async (profile: any, accessToken: any, refreshToken: any): Promise<IDtoUser> => {
    return new DtoUser({
        email: profile._json.email,
        sub: profile._json.sub,
        displayName: profile._json.displayName,
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

const serializeUser = (user: Express.User, done: (err: any, id?: unknown) => void) => {
    LOGGER.info(`Serialize user with id ${(user as IDtoUser).sub}`);
    done(null, (user as IDtoUser).sub)
}

const deserializeUser = (id: string, done: (err: any, user?: false | Express.User | null | undefined) => void) => {
    LOGGER.info(`Deserialize User with id ${id}`);
    DtoUser.findOne({ sub: id })
        .then(user => done(null, user))
        .catch(err => done(err, null))
}