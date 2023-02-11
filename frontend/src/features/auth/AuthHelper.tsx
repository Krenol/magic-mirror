import { useCallback } from 'react';
import { useGetAuthStatus } from '../../apis/auth_status';
import { useAppDispatch } from '../../app/hooks';
import { APP_BASE_URL } from '../../constants/app';
import { setAuthenticated } from './authSlice'

const SessionCheck = () => {
    const dispatch = useAppDispatch();

    const handleSessionCheckResponse = useCallback(async (authenticated: boolean) => {
        dispatch(setAuthenticated(authenticated));
        if (!authenticated) {
            window.location.href = APP_BASE_URL;
        }
    }, [dispatch]);

    useGetAuthStatus(handleSessionCheckResponse);

    return (null);
}

export default SessionCheck;