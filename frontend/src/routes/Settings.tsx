import React, { useEffect, useState } from 'react';
import { Box, TextField } from '@mui/material';
import SessionCheck from '../features/auth/AuthHelper';
import { logout } from "../apis/logout"
import CountrySelect from '../features/country_select/CountrySelect';



export const Settings = () => {
    const [country, setCountry] = useState("");

    useEffect(() => console.log(country), [country])
    return (
        <React.Fragment>
            <SessionCheck onUnauthenticated={logout} />
            <CountrySelect inputCallback={setCountry} />
            <Box
                component="form"
                sx={{
                    '& > :not(style)': { width: '50ch' },
                }}
                noValidate
                autoComplete="off"
            >
                <TextField id="city" label="City" variant="outlined" />
            </Box>
        </React.Fragment>
    );
}