import { useQuery } from "react-query";
import { QUERY_PARAMS } from "../models/apis";
import { ServerStateKeysEnum } from "../common/statekeys";
import { buildQuery } from "../common/apis";
import { fetchJson } from "../common/fetch";
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
