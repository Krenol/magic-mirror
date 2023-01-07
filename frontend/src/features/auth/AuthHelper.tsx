import { useCallback, useEffect } from 'react';
import { useAppDispatch } from '../../app/hooks';
import { DEFAULT_FETCH_CONFIG, SESSION_STATUS_API } from '../../constants/api';
import { APP_BASE_URL, REFRESH_MILLIS } from '../../constants/app';
import { setAuthenticated } from './authSlice'

const SessionCheck = () => {
    const dispatch = useAppDispatch();

    const handleSessionCheckResponse = useCallback(async (authenticated: boolean) => {
        dispatch(setAuthenticated(authenticated));
        if (!authenticated) {
            window.location.href = APP_BASE_URL;
        }
    }, [dispatch]);

    const setSessionStatus = useCallback(async () => await fetch(SESSION_STATUS_API, DEFAULT_FETCH_CONFIG)
        .then((res) => handleSessionCheckResponse(res.status === 200))
        .catch(() => handleSessionCheckResponse(false)), [handleSessionCheckResponse]
    );

    useEffect(() => {
        setSessionStatus();
        const timer = setInterval(() => {
            setSessionStatus();
        }, REFRESH_MILLIS);
        return () => clearInterval(timer);
    }, [setSessionStatus]);

    return (null);
}

export default SessionCheck;