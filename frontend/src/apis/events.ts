import { useQuery } from "react-query";
import { buildQuery } from "../app/apis";
import { fetchJson } from "../app/fetch";
import { ServerStateKeysEnum } from "../app/statekeys";
import { EVENTS_API, REFETCH_INTERVAL } from "../constants/api";
import { QUERY_PARAMS } from "../models/apis";
import { EventList } from "../models/calendar";

export const useGetEvents = (query_params: QUERY_PARAMS = []) => {
    return useQuery<EventList, Error>({
        queryKey: [ServerStateKeysEnum.events, JSON.stringify(query_params)],
        queryFn: async () => buildQuery(query_params)
            .then(qry => fetchJson(`${EVENTS_API}${qry}`))
            .catch(err => { throw err; }),
        refetchInterval: REFETCH_INTERVAL,
    })
}

