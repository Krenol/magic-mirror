import { ALLOWED_URLS } from "../config/apis";
import { TResponse } from "../models/fetch";

export const fetchJson = async (url: string, options: any = {}): Promise<TResponse> => {
    return checkInputURL(url)
        .then(() => fetch(url, options))
        .then(response => parseJsonResponse(response))
        .catch(err => { throw err });
};

const parseJsonResponse = async (res: Response): Promise<TResponse> => {
    return {
        body: await res.json(),
        status: res.status
    }
}

export const fetchBuffer = async (url: string, options: any = {}): Promise<TResponse> => {
    return checkInputURL(url)
        .then(() => fetch(url, options))
        .then(response => parseBufferResponse(response))
        .catch(err => { throw err });
};

const parseBufferResponse = async (res: Response): Promise<TResponse> => {
    return {
        body: await res.arrayBuffer(),
        status: res.status
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