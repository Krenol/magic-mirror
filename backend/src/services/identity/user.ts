import { LOGIN_STRATEGY_NAME } from "config";
import { IDtoUser } from "models/mongo/users";
import AuthTokenRefresh from "passport-oauth2-refresh";
import { LOGGER } from "services/loggers";

export const getEmail = async (user?: IDtoUser): Promise<string> => {
    if (user?.email) {
        return user.email;
    }
    throw Object.assign(
        new Error(`User has no email address defined!`),
    );
}

export const getAccessToken = async (user?: IDtoUser): Promise<string> => {
    if (user?.access_token) {
        return user.access_token;
    }
    throw Object.assign(
        new Error(`User has no access_token defined!`),
    );
}

export const getRefreshToken = async (user?: IDtoUser): Promise<string> => {
    if (user?.refresh_token) {
        return user.refresh_token;
    }
    throw Object.assign(
        new Error(`User has no refresh_token defined!`),
    );
}

export const getAuthenticationHeader = async (user?: IDtoUser): Promise<RequestInit> => {
    const access_token = await getAccessToken(user);
    return { headers: { Authorization: `Bearer ${access_token}` } }
}

export const userTokenRefresh = async (user: IDtoUser): Promise<IDtoUser | undefined> => {
    return AuthTokenRefresh.requestNewAccessToken(LOGIN_STRATEGY_NAME, user.refresh_token, async (err: { statusCode: number; data?: any; }, accessToken: string) => {
        if (err || !accessToken) {
            LOGGER.error(`Refresh request failed with error ${err.data}`);
            return;
        }
        user.access_token = accessToken;
        user.save();
        return user;
    });
}