import { useCallback } from "react";
import { useGetAuthStatus } from "../../apis/auth_status";
import { useAppDispatch } from "../../common/hooks";
import { setAuthenticated } from "../../common/slices/authSlice";
import { REFETCH_INTERVAL } from "../../constants/api";

interface ISessionCheck {
  onUnauthenticated?: () => void;
  onAuthenticated?: () => void;
  refetchInterval?: number;
  disabled?: boolean;
}

const SessionCheck = ({
  onUnauthenticated,
  onAuthenticated,
  refetchInterval = REFETCH_INTERVAL,
  disabled = false,
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
    [dispatch, onUnauthenticated, onAuthenticated]
  );
  const authCb = disabled ? undefined : handleSessionCheckResponse;
  useGetAuthStatus(authCb, refetchInterval);
  return null;
};

export default SessionCheck;
