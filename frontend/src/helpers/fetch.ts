import { DEFAULT_FETCH_CONFIG } from "../constants/api";

export const fetchJson = async (url: string, options: RequestInit = {}, allowed_status_codes: Array<number> = [200], retries: number = 1): Promise<any> => {
    return fetchRetry(url, options, allowed_status_codes, retries)
        .then(response => response.json())
};

export const fetchBlob = async (url: string, options: RequestInit = {}, allowed_status_codes: Array<number> = [200], retries: number = 1): Promise<Blob> => {
    return fetchRetry(url, options, allowed_status_codes, retries)
        .then(response => {
            const reader = response?.body?.getReader();
            return getReadableStream(reader);
        })
        .then(stream => new Response(stream))
        .then(response => response.blob())
};

//https://dev.to/ycmjason/javascript-fetch-retry-upon-failure-3p6g
export const fetchRetry = async (url: string, options: RequestInit = {}, allowed_status_codes: Array<number> = [200], retries: number = 1): Promise<Response> => {
    try {
        return await fetch(url, { ...options, ...DEFAULT_FETCH_CONFIG })
            .then(response => checkHttpStatusCode(response, allowed_status_codes, url))
    } catch (err) {
        if (retries <= 1) throw err;
        return fetchRetry(url, options, allowed_status_codes, retries - 1);
    }
};

const checkHttpStatusCode = async (response: Response, allowed_status_codes: Array<number>, url?: string): Promise<Response> => {
    if (allowed_status_codes.includes(response.status)) {
        return response;
    } else {
        throw Object.assign(
            new Error(`Request to ${url ?? "URL"} failed with status code ${response.status}`),
            { code: response.status }
        );
    }
}

const getReadableStream = async (reader?: ReadableStreamDefaultReader<Uint8Array>) => {
    return new ReadableStream({
        start(controller: ReadableStreamController<any>) {
            return streamPump(controller, reader);
        }
    })
};

const streamPump = (controller: ReadableStreamController<any>, reader?: ReadableStreamDefaultReader<Uint8Array>): any => {
    return reader?.read().then(({ done, value }) => {
        if (done) {
            controller.close();
            return;
        }
        controller.enqueue(value);
        return streamPump(controller, reader);
    });
};
