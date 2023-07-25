import { QUERY_PARAM, QUERY_PARAMS } from "../models/apis";

export const buildQuery = async (
  query_params: QUERY_PARAMS = [],
): Promise<string> => {
  if (query_params.length === 0) return "";
  const queryParams = query_params.map((p) => buildQueryParam(p)).join("&");
  return `?${queryParams}`;
};

const buildQueryParam = (query_param: QUERY_PARAM): string =>
  `${query_param.name}=${query_param.value}`;
