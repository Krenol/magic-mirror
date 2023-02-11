import { useQuery } from "react-query";
import { getDayName } from "../app/dateParser";
import { ServerStateKeysEnum } from "../app/statekeys";
import { DEFAULT_LOCALE } from "../constants/defaults";

export const useGetDayName = (date: Date, locale: string = DEFAULT_LOCALE) =>
    useQuery<string, Error>({
        queryKey: [ServerStateKeysEnum.time, date, locale],
        queryFn: async () => getDayName(date, locale)
    });