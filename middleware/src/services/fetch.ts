import { TResponse } from "../models/fetch";

export const fetchJson = async (url: string, options: any = {}): Promise<TResponse> => {
    return fetch(url, options)
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
    return fetch(url, options)
        .then(response => parseBufferResponse(response))
        .catch(err => { throw err });
};

const parseBufferResponse = async (res: Response): Promise<TResponse> => {
    return {
        body: await res.arrayBuffer(),
        status: res.status
    }
}


