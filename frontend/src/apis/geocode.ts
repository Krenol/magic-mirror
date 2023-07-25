import { useQuery } from "react-query";
import { QUERY_PARAMS } from "../models/apis";
import { ServerStateKeysEnum } from "../helpers/statekeys";
import { buildQuery } from "../helpers/apis";
import { fetchJson } from "../helpers/fetch";
import { GeoLocation } from "../models/location";
import { LOCATION_API } from "../constants/api";

export const useGetGeocode = (query_params: QUERY_PARAMS = []) => {
  return useQuery<GeoLocation, Error>({
    queryKey: [ServerStateKeysEnum.geocode, query_params],
    queryFn: async () =>
      buildQuery(query_params)
        .then((qry) => fetchJson(`${LOCATION_API}/geocode${qry}`))
        .catch((err) => {
          throw err;
        }),
    refetchInterval: false,
  });
};
