import { useQuery } from "react-query";
import { buildQuery } from "../common/apis";
import { fetchJson } from "../common/fetch";
import { ServerStateKeysEnum } from "../common/statekeys";
import { EVENTS_API, REFETCH_INTERVAL } from "../constants/api";
import { QueryParameters } from "../models/apis";
import { EventList } from "../models/calendar";

export const useGetEvents = (query_params: QueryParameters = []) => {
  return useQuery<EventList, Error>({
    queryKey: [ServerStateKeysEnum.events, query_params],
    queryFn: async () =>
      buildQuery(query_params)
        .then((qry) => fetchJson<EventList>(`${EVENTS_API}${qry}`))
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
      fetchJson<EventList>(`${EVENTS_API}/${date}`).catch((err) => {
        throw err;
      }),
    refetchInterval: REFETCH_INTERVAL,
  });
};
