import { useQuery } from "react-query";
import { fetchJson } from "../app/fetch";
import { ServerStateKeysEnum } from "../app/statekeys";
import { BIRHTDAY_API, REFETCH_INTERVAL } from "../constants/api";
import { BIRTHDAY_COUNT } from "../constants/events";
import { BirthdayList } from "../models/birthdays";

export const useGetBirthdays = (birthday_count: number = BIRTHDAY_COUNT) =>
    useQuery<BirthdayList, Error>({
        queryKey: [ServerStateKeysEnum.birthdays, birthday_count],
        queryFn: async () => fetchJson(`${BIRHTDAY_API}?count=${birthday_count}`)
            .catch(err => { throw err; }),
        refetchInterval: REFETCH_INTERVAL,
    });
