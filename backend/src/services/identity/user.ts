import { LOGIN_STRATEGY_NAME } from "config";
import { Request } from "express";
import { IDtoUser } from "models/mongo/users";
import AuthTokenRefresh from "passport-oauth2-refresh";
import { LOGGER } from "services/loggers";

export const getAuthenticationHeader = async (
  req: Request
): Promise<RequestInit> => {
  const access_token = req.headers["x-forwarded-access-token"] as string;
  return { headers: { Authorization: `Bearer ${access_token}` } };
};

export const userTokenRefresh = async (user: IDtoUser): Promise<IDtoUser> => {
  return new Promise<IDtoUser>((resolve, reject) => {
    LOGGER.info(`Start refresh of access token for user ${user.sub}`);
    AuthTokenRefresh.requestNewAccessToken(
      LOGIN_STRATEGY_NAME,
      user.refresh_token,
      async (err: { statusCode: number; data?: any }, accessToken: string) => {
        if (err || !accessToken) {
          LOGGER.error(`Refresh request failed with error ${err.data}`);
          reject(`Refresh request failed with error ${err.data}`);
        }
        LOGGER.info(`Refreshed access token for user ${user.sub}`);
        user.access_token = accessToken;
        user.save().then(resolve);
      }
    );
  });
};
