import { QUERY_PARAM, QUERY_PARAMS } from "../models/apis";

export const buildQuery = async (
  query_params: QUERY_PARAMS = []
): Promise<string> => {
  if (query_params.length === 0) return "";
  const queryParams = query_params
    .map((p) => buildQueryParam(p))
    .filter(isQueryParam)
    .join("&");
  return `?${queryParams}`;
};

const buildQueryParam = (query_param: QUERY_PARAM) => {
  if (query_param.value) {
    return `${query_param.name}=${query_param.value}`;
  }
};

const isQueryParam = (item: string | undefined): item is string => {
  return !!item;
};
