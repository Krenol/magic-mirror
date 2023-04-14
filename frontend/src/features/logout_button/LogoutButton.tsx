import { Button } from '@mui/material';
import React from 'react';
import { logout } from '../../apis/logout';

export const LogoutButton = () => {
    return (
        <React.Fragment>
            <Button variant="outlined" onClick={logout}>Logout</Button>
        </React.Fragment>
    )
}