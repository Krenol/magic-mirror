import { ALLOWED_URLS, LOGIN_STRATEGY_NAME } from "config";
import { TResponse } from "models/api/fetch";
import { LOGGER } from "services/loggers";
import { IDtoUser } from "models/mongo/users";
import { getAuthenticationHeader, userTokenRefresh } from "services/identity/user";
import { ApiError } from "models/api/api_error";
import AuthTokenRefresh from "passport-oauth2-refresh";

export const fetchJson = async (url: string, options: RequestInit = {}, logUrl: string | undefined = undefined): Promise<TResponse> => {
    LOGGER.info(`Calling API ${logUrl || url} to get JSON`);
    return checkInputURL(url)
        .then(() => fetch(url, options))
        .then(response => logFetch(response, logUrl || url))
        .then(response => parseJsonResponse(response))
        .catch(err => logFetchErr(err, logUrl || url));
};

const logFetch = async (res: Response, url: string): Promise<Response> => {
    LOGGER.info(`Call to API ${url} returned status code ${res.status}`);
    return res;
}

const logFetchErr = async (err: Error, url: string) => {
    LOGGER.error(`Call to API ${url} returned error '${err.message}'`);
    throw err;
}

const parseJsonResponse = async (res: Response): Promise<TResponse> => {
    return {
        body: await res.json(),
        status: res.status,
        statusOk: res.ok
    }
}

export const fetchJsonGoogleAuthRefresh = async (url: string, user: IDtoUser, logUrl: string | undefined = undefined): Promise<TResponse | undefined> => {
    var refreshRetries = 1;
    const _fetchJsonGoogleAuthRefresh = async () => {
        return getAuthenticationHeader(user)
            .then(authHeader => fetchJson(url, authHeader, logUrl))
            .then(rsp => {
                if (rsp.status === 401 && refreshRetries > 0) {
                    LOGGER.info(`Start refresh of access token for user ${user.sub}`);
                    --refreshRetries;
                    AuthTokenRefresh.requestNewAccessToken(LOGIN_STRATEGY_NAME, user.refresh_token, (err: { statusCode: number; data?: any; }, access_token: string) => {
                        if (err || !access_token) {
                            LOGGER.error(`Refresh request failed with error ${err.data}`);
                            throw new ApiError("Token refresh failed", undefined, 500);
                        }
                        LOGGER.info(`Refreshed access token for user ${user.sub}`);
                        user.access_token = access_token;
                        return user.save()
                            .then(() => _fetchJsonGoogleAuthRefresh());
                    });
                } else if (rsp.status === 401 && refreshRetries === 0) {
                    LOGGER.error(`Unauthenticated Google Request. No more retries left!`);
                    return return401Response();
                } else {
                    return rsp;
                }
            })
    };
    return _fetchJsonGoogleAuthRefresh();
};

const return401Response = async (): Promise<TResponse> => {
    return {
        body: { error: 'Unauthenticated request' },
        status: 401,
        statusOk: false
    }
}

export const fetchBuffer = async (url: string, options: any = {}, logUrl: string | undefined = undefined): Promise<TResponse> => {
    LOGGER.info(`Calling API ${logUrl || url} to get BLOB`);
    return checkInputURL(url)
        .then(() => fetch(url, options))
        .then(response => logFetch(response, logUrl || url))
        .then(response => parseBufferResponse(response))
        .catch(err => logFetchErr(err, logUrl || url));
};

const parseBufferResponse = async (res: Response): Promise<TResponse> => {
    return {
        body: await res.arrayBuffer(),
        status: res.status,
        statusOk: res.ok
    }
}

const checkInputURL = async (url: string) => {
    isAllowedURL(url).then(res => (checkUrlAllowedResponse(res, url)));
}

const isAllowedURL = async (url: string): Promise<boolean> => {
    return ALLOWED_URLS.some(allowed_url => url.startsWith(allowed_url));
}

const checkUrlAllowedResponse = async (isAllowed: boolean, url: string) => {
    if (isAllowed) return;
    throw new Error(`Invalid URL given! URL ${url} is not part of the allowed URL list!`);
}