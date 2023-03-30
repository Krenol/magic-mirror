import { useCallback } from 'react';
import { useGetAuthStatus } from '../../apis/auth_status';
import { useAppDispatch } from '../../app/hooks';
import { setAuthenticated } from './authSlice'

interface ISessionCheck {
    onUnauthenticated?: () => void,
    onAuthenticated?: () => void,
}

const SessionCheck = ({ onUnauthenticated, onAuthenticated }: ISessionCheck) => {
    const dispatch = useAppDispatch();

    const handleSessionCheckResponse = useCallback(async (authenticated: boolean) => {
        dispatch(setAuthenticated(authenticated));
        if (!authenticated && onUnauthenticated) {
            onUnauthenticated();
        } else if (authenticated && onAuthenticated) {
            onAuthenticated();
        }
    }, [dispatch, onUnauthenticated, onAuthenticated]);

    useGetAuthStatus(handleSessionCheckResponse);
    return (null)
}

export default SessionCheck;