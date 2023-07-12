import { useQuery } from "react-query";
import { ServerStateKeysEnum } from "../helpers/statekeys";
import { DEFAULT_FETCH_CONFIG, REFETCH_INTERVAL, SESSION_STATUS_API } from "../constants/api";

export const useGetAuthStatus = (cb?: (status: boolean) => void, refetchInterval: number = REFETCH_INTERVAL) =>
    useQuery<boolean, Error>({
        queryKey: [ServerStateKeysEnum.auth_status, cb, refetchInterval],
        queryFn: async () => fetch(SESSION_STATUS_API, DEFAULT_FETCH_CONFIG)
            .then((res) => handleResponse(res.status, cb))
            .catch(err => { throw err; }),
        refetchInterval,
        retry: 3,
        retryDelay: 100
    });

const handleResponse = async (status: number, cb?: (status: boolean) => void): Promise<boolean> => {
    const is_authenticated = status === 200;
    if (cb) {
        cb(is_authenticated);
    }
    return is_authenticated;
}