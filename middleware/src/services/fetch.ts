import { ALLOWED_URLS } from "../config/apis";
import { ApiError } from "../models/api_error";
import { TResponse } from "../models/fetch";
import { User } from "../models/user";
import { LOGGER } from "./loggers";
var refresh = require('passport-oauth2-refresh');

export const fetchJson = async (url: string, options: any = {}): Promise<TResponse> => {
    return checkInputURL(url)
        .then(() => fetch(url, options))
        .then(response => parseJsonResponse(response))
        .catch(err => { throw err });
};

const parseJsonResponse = async (res: Response): Promise<TResponse> => {
    return {
        body: await res.json(),
        status: res.status,
        statusOk: res.ok
    }
}

export const fetchJsonGoogleAuthRefresh = async (url: string, options: any = {}, user: User): Promise<TResponse> => {
    return _fetchJsonGoogleAuthRefresh(url, options, user, 1);
};

const _fetchJsonGoogleAuthRefresh = async (url: string, options: any = {}, user: User, refreshRetries: number): Promise<TResponse> => {
    const rsp = await fetchJson(url, options);
    if (rsp.status === 401 && refreshRetries > 0) {
        LOGGER.info(`Unauthenticated Google Request. Retry with refresh token of user`);
        refresh.requestNewAccessToken('google', user.refresh_token, (err: Error, accessToken: string) => {
            if (err || !accessToken) throw new ApiError('Authentication expired', err, 401);
            user.access_token = accessToken;
            _fetchJsonGoogleAuthRefresh(url, options, user, refreshRetries--);
        })
    } else if (rsp.status === 401 && refreshRetries === 0) {
        LOGGER.warn(`Unauthenticated Google Request. No more retries left!`);
        throw new ApiError('Unauthenticated request', new Error(), 401);
    }
    return rsp;
};

export const fetchBuffer = async (url: string, options: any = {}): Promise<TResponse> => {
    return checkInputURL(url)
        .then(() => fetch(url, options))
        .then(response => parseBufferResponse(response))
        .catch(err => { throw err });
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