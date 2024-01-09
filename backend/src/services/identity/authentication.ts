import passport from "passport";
import { GOOGLE_LOGIN_STRATEGY_OPTIONS, LOGIN_STRATEGY_NAME } from "config";
import { DtoUser, IDtoUser } from "models/mongo/users";
import { LOGGER } from "services/loggers";
import AuthTokenRefresh from "passport-oauth2-refresh";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { serializeUser, deserializeUser } from "services/identity";

export const setupPassportAuthentication = () => {
  LOGGER.info("Setup passport strategy");
  const strategy = new Strategy(
    GOOGLE_LOGIN_STRATEGY_OPTIONS,
    authenticateUser
  );
  passport.use(LOGIN_STRATEGY_NAME, strategy);
  passport.serializeUser(serializeUser);
  passport.deserializeUser(deserializeUser);
  AuthTokenRefresh.use(LOGIN_STRATEGY_NAME, strategy);
};

const authenticateUser = (
  _request: any,
  accessToken: any,
  refreshToken: any,
  profile: any,
  done: VerifyCallback
) => {
  DtoUser.findOne({ sub: profile._json.sub })
    .then((user) =>
      handleFindUserInDbResponse(
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
  user: IDtoUser | null,
  accessToken: any,
  refreshToken: any,
  done: VerifyCallback
) => {
  if (!user) {
    LOGGER.error(`Unregistered user tried to log in.`);
    done("Unregistered log in attempt", undefined);
  } else {
    handleFoundUser(user, accessToken, refreshToken, done);
  }
};

const handleFoundUser = (
  user: IDtoUser,
  accessToken: any,
  refreshToken: any,
  done: VerifyCallback
) => {
  user.refresh_token = refreshToken;
  user.access_token = accessToken;
  user
    .save()
    .then((u) => {
      LOGGER.info(`User ${user.sub} signed in`);
      return u;
    })
    .then((u) => done(null, u));
};
