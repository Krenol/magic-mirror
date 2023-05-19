import { useQuery } from "react-query";
import { fetchJson } from "../app/fetch";
import { ServerStateKeysEnum } from "../app/statekeys";
import { USER_SETTINGS_API } from "../constants/api";
import { UserSettings } from "../models/user_settings";

export const useGetUserSettings = () =>
    useQuery<UserSettings, Error>({
        queryKey: [ServerStateKeysEnum.user_settings],
        queryFn: async () => fetchJson(USER_SETTINGS_API)
            .catch(err => { throw err; }),
        refetchInterval: false,
    });
