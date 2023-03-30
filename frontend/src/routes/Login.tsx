import Button from '@mui/material/Button';
import React from 'react';
import { GOOGLE_LOGIN_URL } from '../constants/api';
import SessionCheck from '../features/auth/AuthHelper';

const Login = () => {
    return (
        <React.Fragment>
            <SessionCheck onAuthenticated={() => window.location.href = "/"} />
            <Button variant="outlined" href={GOOGLE_LOGIN_URL}>Login with Google</Button>
        </React.Fragment>
    );
}

export default Login;