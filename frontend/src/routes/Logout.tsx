import React, { useEffect } from 'react';
import { DEFAULT_FETCH_CONFIG, LOGOUT_URL } from '../constants/api';
import { APP_BASE_URL } from '../constants/defaults';

const Logout = () => {
    useEffect(() => {
        let object: RequestInit = { method: 'POST', redirect: 'follow' };
        fetch(LOGOUT_URL, { ...object, ...DEFAULT_FETCH_CONFIG })
            .then(() => window.location.href = APP_BASE_URL)
            .catch((err) => {
                console.log(err)
                window.location.href = APP_BASE_URL
            })
    }, []);

    return (
        <React.Fragment>
            <h3>Logging out...</h3>
            <div>You will be redirected after the logout was successful</div>
        </React.Fragment>
    );
}

export default Logout;