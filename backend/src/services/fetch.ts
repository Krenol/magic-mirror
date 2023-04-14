import { ALLOWED_URLS } from "config/apis";
import { ApiError } from "models/api/api_error";
import { TResponse } from "models/api/fetch";
import { GoogleUser } from "models/api/express_user";
import { LOGGER } from "services/loggers";
const refresh = require('passport-oauth2-refresh');

export const fetchJson = async (url: string, options: any = {}, logUrl: string | undefined = undefined): Promise<TResponse> => {
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

export const fetchJsonGoogleAuthRefresh = async (url: string, user: GoogleUser, options: any = {}, logUrl: string | undefined = undefined): Promise<TResponse> => {
    return _fetchJsonGoogleAuthRefresh(url, user, options, 1, logUrl);
};

const _fetchJsonGoogleAuthRefresh = async (url: string, user: GoogleUser, options: any = {}, refreshRetries: number, logUrl: string | undefined = undefined): Promise<TResponse> => {
    const rsp = await fetchJson(url, options, logUrl);
    if (rsp.status === 401 && refreshRetries > 0) {
        LOGGER.info(`Unauthenticated Google Request. Retry with refresh token of user`);
        refresh.requestNewAccessToken('google', user.refresh_token, (err: Error, accessToken: string) => {
            if (err || !accessToken) {
                LOGGER.error(`Refresh request failed with error ${err.message}`)
                throw new ApiError('Authentication expired', err, 401);
            }
            user.access_token = accessToken;
            _fetchJsonGoogleAuthRefresh(url, options, user, refreshRetries--, logUrl);
        })
    } else if (rsp.status === 401 && refreshRetries === 0) {
        LOGGER.warn(`Unauthenticated Google Request. No more retries left!`);
        throw new ApiError('Unauthenticated request', new Error(), 401);
    }
    return rsp;
};

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