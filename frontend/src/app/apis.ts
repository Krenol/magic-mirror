import { QUERY_PARAMS } from "../models/apis";

export const buildQuery = async (query_params: QUERY_PARAMS = []): Promise<string> => {
    if (query_params.length === 0) return "";
    return `?${query_params.map(p => `${p.name}=${p.value}`).join('&')}`
}