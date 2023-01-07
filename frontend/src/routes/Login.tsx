import Button from '@mui/material/Button';
import React from 'react';
import { GOOGLE_LOGIN_URL } from '../constants/api';

const Login = () => {
    return (
        <React.Fragment>
            <Button variant="outlined" href={GOOGLE_LOGIN_URL}>Login with Google</Button>
        </React.Fragment>
    );
}

export default Login;