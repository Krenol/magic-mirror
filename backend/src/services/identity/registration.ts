import passport from "passport";
import {
  GOOGLE_REGISTER_STRATEGY_OPTIONS,
  REGISTER_STRATEGY_NAME,
} from "config";
import { DtoUser, IDtoUser } from "models/mongo/users";
import { LOGGER } from "services/loggers";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { checkIfAuthorizedNewUser } from "services/identity/authorization";
import { serializeUser, deserializeUser } from "services/identity";
import { UNAUTHORIZED, USER_ALREADY_REGISTERED } from "./errors";

export const setupPassportRegistration = () => {
  LOGGER.info("Setup passport strategy");
  const strategy = new Strategy(GOOGLE_REGISTER_STRATEGY_OPTIONS, registerUser);
  passport.use(REGISTER_STRATEGY_NAME, strategy);
  passport.serializeUser(serializeUser);
  passport.deserializeUser(deserializeUser);
};

const registerUser = (
  _request: any,
  accessToken: any,
  refreshToken: any,
  profile: any,
  done: VerifyCallback
) => {
  DtoUser.findOne({ sub: profile._json.sub })
    .then((user) =>
      handleFindUserInDbResponse(
        profile,
        user as IDtoUser,
        accessToken,
        refreshToken,
        done
      )
    )
    .catch((err) => {
      LOGGER.error(err.message);
      done(err, undefined);
    });
};

const handleFindUserInDbResponse = (
  profile: any,
  user: IDtoUser | null,
  accessToken: any,
  refreshToken: any,
  done: VerifyCallback
) => {
  if (!user) {
    handleNewUser(profile, accessToken, refreshToken, done);
  } else {
    LOGGER.error(`Registered user ${user.sub} tried to register.`);
    done(USER_ALREADY_REGISTERED, undefined);
  }
};

const handleNewUser = (
  profile: any,
  accessToken: any,
  refreshToken: any,
  done: VerifyCallback
) => {
  checkIfAuthorizedNewUser(profile._json.email)
    .then((authorized) =>
      handleAuthorizationResponse(
        authorized,
        profile,
        accessToken,
        refreshToken,
        done
      )
    )
    .catch((err) => done(err, undefined));
};

const handleAuthorizationResponse = async (
  authorized: boolean,
  profile: any,
  accessToken: any,
  refreshToken: any,
  done: VerifyCallback
) => {
  if (authorized) {
    return handleAuthorizedUser(profile, accessToken, refreshToken, done);
  }
  return done(UNAUTHORIZED, undefined);
};

const handleAuthorizedUser = async (
  profile: any,
  accessToken: any,
  refreshToken: any,
  done: VerifyCallback
) => {
  return createNewUserDto(profile, accessToken, refreshToken)
    .then((user) => user.save())
    .then((u) => {
      LOGGER.info(
        `New User ${profile._json.sub} registered with email ${profile._json.email}`
      );
      return u;
    })
    .then((u) => done(null, u))
    .catch((err) => done(err, undefined));
};

const createNewUserDto = async (
  profile: any,
  accessToken: any,
  refreshToken: any
): Promise<IDtoUser> => {
  return new DtoUser({
    email: profile._json.email,
    sub: profile._json.sub,
    displayName: profile._json.displayName,
    refresh_token: refreshToken,
    access_token: accessToken,
  }) as IDtoUser;
};
