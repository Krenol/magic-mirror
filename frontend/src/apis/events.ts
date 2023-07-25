import { useQuery } from "react-query";
import { buildQuery } from "../helpers/apis";
import { fetchJson } from "../helpers/fetch";
import { ServerStateKeysEnum } from "../helpers/statekeys";
import { EVENTS_API, REFETCH_INTERVAL } from "../constants/api";
import { QUERY_PARAMS } from "../models/apis";
import { EventList } from "../models/calendar";

export const useGetEvents = (query_params: QUERY_PARAMS = []) => {
  return useQuery<EventList, Error>({
    queryKey: [ServerStateKeysEnum.events, query_params],
    queryFn: async () =>
      buildQuery(query_params)
        .then((qry) => fetchJson(`${EVENTS_API}${qry}`))
        .catch((err) => {
          throw err;
        }),
    refetchInterval: REFETCH_INTERVAL,
  });
};

export const useGetDateEvents = (date: string) => {
  return useQuery<EventList, Error>({
    queryKey: [ServerStateKeysEnum.events_day, date],
    queryFn: async () =>
      fetchJson(`${EVENTS_API}/${date}`).catch((err) => {
        throw err;
      }),
    refetchInterval: REFETCH_INTERVAL,
  });
};
