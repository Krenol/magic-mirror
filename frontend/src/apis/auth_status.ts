import { useQuery } from "react-query";
import { ServerStateKeysEnum } from "../app/statekeys";
import { DEFAULT_FETCH_CONFIG, REFETCH_INTERVAL, SESSION_STATUS_API } from "../constants/api";

export const useGetAuthStatus = (cb?: (status: boolean) => void) =>
    useQuery<boolean, Error>({
        queryKey: [ServerStateKeysEnum.auth_status, cb],
        queryFn: async () => fetch(SESSION_STATUS_API, DEFAULT_FETCH_CONFIG)
            .then((res) => handleResponse(res.status, cb))
            .catch(err => { throw err; }),
        refetchInterval: REFETCH_INTERVAL,
    });

const handleResponse = async (status: number, cb?: (status: boolean) => void): Promise<boolean> => {
    const is_authenticated = status === 200;
    if (cb) {
        cb(is_authenticated);
    }
    return is_authenticated;
}