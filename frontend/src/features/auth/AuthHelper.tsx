import { useCallback } from 'react';
import { useGetAuthStatus } from '../../apis/auth_status';
import { logout } from '../../apis/logout';
import { useAppDispatch } from '../../app/hooks';
import { setAuthenticated } from './authSlice'

const SessionCheck = () => {
    const dispatch = useAppDispatch();

    const handleSessionCheckResponse = useCallback(async (authenticated: boolean) => {
        dispatch(setAuthenticated(authenticated));
        if (!authenticated) {
            logout();
        }
    }, [dispatch]);

    useGetAuthStatus(handleSessionCheckResponse);
    return (null)
}

export default SessionCheck;