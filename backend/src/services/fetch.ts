import { ALLOWED_URLS } from "config";
import { TResponse } from "models/api/fetch";
import { LOGGER } from "services/loggers";
import { IDtoUser } from "models/mongo/users";
import { userTokenRefresh } from "./identity/user";
import { ApiError } from "models/api/api_error";

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

export const fetchJsonGoogleAuthRefresh = async (url: string, user: IDtoUser, options: any = {}, logUrl: string | undefined = undefined): Promise<TResponse> => {
    return _fetchJsonGoogleAuthRefresh(url, user, options, 1, logUrl);
};

const _fetchJsonGoogleAuthRefresh = async (url: string, user: IDtoUser, options: any = {}, refreshRetries: number, logUrl: string | undefined = undefined): Promise<TResponse> => {
    const rsp = await fetchJson(url, options, logUrl);
    if (rsp.status === 401 && refreshRetries > 0) {
        LOGGER.info(`Unauthenticated Google Request. Retry with refresh token of user`);
        handleTokenRefresh(url, user, options, refreshRetries, logUrl);
    } else if (rsp.status === 401 && refreshRetries === 0) {
        LOGGER.error(`Unauthenticated Google Request. No more retries left!`);
        return return401Response();
    }
    return rsp;
};

const handleTokenRefresh = async (url: string, user: IDtoUser, options: any = {}, refreshRetries: number, logUrl: string | undefined = undefined) => {
    userTokenRefresh(user)
        .then(checkTokenRefreshResponse)
        .then(u => _fetchJsonGoogleAuthRefresh(url, { ...options, headers: { Authorization: `Bearer ${u.access_token}` } }, u, --refreshRetries, logUrl))
        .catch(return401Response);
}

const checkTokenRefreshResponse = async (user?: IDtoUser): Promise<IDtoUser> => {
    if (user) return user;
    throw new ApiError("Error during token refresh", undefined, 500);
}

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