import { useQuery } from "react-query";
import { fetchJson } from "../helpers/fetch";
import { ServerStateKeysEnum } from "../helpers/statekeys";
import { USER_SETTINGS_API } from "../constants/api";
import { UserSettings } from "../models/user_settings";

export const useGetUserSettings = (allowNotFound = false) =>
  useQuery<UserSettings, Error>({
    queryKey: [ServerStateKeysEnum.user_settings, allowNotFound],
    queryFn: async () =>
      fetchJson(
        `${USER_SETTINGS_API}/me`,
        undefined,
        allowNotFound ? [200, 404] : [200],
      ).catch((err) => {
        throw err;
      }),
    refetchInterval: false,
  });
