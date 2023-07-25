import { useCallback } from "react";
import { useGetAuthStatus } from "../../apis/auth_status";
import { useAppDispatch } from "../../helpers/hooks";
import { setAuthenticated } from "./authSlice";
import { REFETCH_INTERVAL } from "../../constants/api";

interface ISessionCheck {
  onUnauthenticated?: () => void;
  onAuthenticated?: () => void;
  refetchInterval?: number;
}

const SessionCheck = ({
  onUnauthenticated,
  onAuthenticated,
  refetchInterval = REFETCH_INTERVAL,
}: ISessionCheck) => {
  const dispatch = useAppDispatch();

  const handleSessionCheckResponse = useCallback(
    (authenticated: boolean) => {
      dispatch(setAuthenticated(authenticated));
      if (!authenticated && onUnauthenticated) {
        onUnauthenticated();
      } else if (authenticated && onAuthenticated) {
        onAuthenticated();
      }
    },
    [dispatch, onUnauthenticated, onAuthenticated],
  );

  useGetAuthStatus(handleSessionCheckResponse, refetchInterval);
  return null;
};

export default SessionCheck;
