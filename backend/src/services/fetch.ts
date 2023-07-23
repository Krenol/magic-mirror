import { ALLOWED_URLS } from "config";
import { TResponse } from "models/api/fetch";
import { LOGGER } from "services/loggers";
import { IDtoUser } from "models/mongo/users";
import { getAuthenticationHeader, userTokenRefresh } from "./identity/user";

export const fetchJson = async (url: string, options: RequestInit = {}, logUrl: string | undefined = undefined): Promise<TResponse> => {
    LOGGER.info(`Calling API ${logUrl ?? url} to get JSON`);
    return checkInputURL(url)
        .then(() => fetch(url, options))
        .then(response => logFetch(response, logUrl ?? url))
        .then(response => parseJsonResponse(response))
        .catch(err => logFetchErr(err, logUrl ?? url));
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

const _fetchJsonGoogleAuthRefresh = async (url: string, user: IDtoUser, options: any = {}, refreshRetries = 1, logUrl: string | undefined = undefined): Promise<TResponse> => {
    return getAuthenticationHeader(user)
        .then(header => fetchJson(url, { ...options, ...header }, logUrl))
        .then(rsp => handleGoogleAuthRefreshResponse(rsp, url, user, options, refreshRetries, logUrl))
        .catch(return401Response);
};

const handleGoogleAuthRefreshResponse = async (response: TResponse, url: string, user: IDtoUser, options: any = {}, refreshRetries = 2, logUrl: string | undefined = undefined) => {
    if (response.status === 401 && refreshRetries > 0) {
        LOGGER.info(`Unauthenticated Google Request. Retry with refreshed token for user ${user.sub}`);
        return handleTokenRefresh(url, user, options, refreshRetries, logUrl);
    } else if (response.status === 401 && refreshRetries === 0) {
        LOGGER.error(`Unauthenticated Google Request. No more retries left!`);
        return return401Response();
    } else {
        return response;
    }
}

const handleTokenRefresh = async (url: string, user: IDtoUser, options: any = {}, refreshRetries = 2, logUrl: string | undefined = undefined) => {
    return userTokenRefresh(user)
        .then(u => _fetchJsonGoogleAuthRefresh(url, u, options, --refreshRetries, logUrl));
}

const return401Response = async (): Promise<TResponse> => {
    return {
        body: { error: 'Unauthenticated request' },
        status: 401,
        statusOk: false
    }
}

export const fetchBuffer = async (url: string, options: any = {}, logUrl: string | undefined = undefined): Promise<TResponse> => {
    LOGGER.info(`Calling API ${logUrl ?? url} to get BLOB`);
    return checkInputURL(url)
        .then(() => fetch(url, options))
        .then(response => logFetch(response, logUrl ?? url))
        .then(response => parseBufferResponse(response))
        .catch(err => logFetchErr(err, logUrl ?? url));
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