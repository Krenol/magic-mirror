import { useQuery } from "react-query";
import { fetchJson } from "../app/fetch";
import { ServerStateKeysEnum } from "../app/statekeys";
import { EVENTS_API, REFETCH_INTERVAL } from "../constants/api";
import { EVENT_COUNT } from "../constants/events";
import { BirthdayList } from "../models/birthdays";

export const useGetEvents = (event_count: number = EVENT_COUNT) =>
    useQuery<BirthdayList, Error>({
        queryKey: [ServerStateKeysEnum.events, event_count],
        queryFn: async () => fetchJson(`${EVENTS_API}?count=${event_count}`)
            .catch(err => { throw err; }),
        refetchInterval: REFETCH_INTERVAL,
    });
