import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, TextField } from '@mui/material';
import SessionCheck from '../features/auth/AuthHelper';
import { logout } from "../apis/logout"
import CountrySelect from '../features/country_select/CountrySelect';
import { useNavigate } from 'react-router-dom';



export const Settings = () => {
    const navigate = useNavigate();
    const [country, setCountry] = useState("");
    const [userData, setUserData] = useState({
        countryCode: 'DE',
        city: 'Stuttgart',
        zip: '70176'
    })
    const city = useRef("");
    const zip = useRef(userData.zip);

    useEffect(() => console.log(country), [country])
    return (
        <React.Fragment>
            <SessionCheck onUnauthenticated={logout} />
            <CountrySelect inputCallback={setCountry} defaultCityCode={userData.countryCode} />
            <Box
                component="form"
                sx={{
                    '& > :not(style)': { width: '50ch' },
                }}
                noValidate
                autoComplete="off"
            >
                <TextField id="city" label="City" variant="outlined" inputRef={city} defaultValue={userData.city} />
                <TextField id="zip" label="Zip Code" variant="outlined" inputRef={zip} defaultValue={userData.zip} />
                <Button variant="outlined" onClick={() => console.log(city.current?.value)}>Send</Button>
                <Button variant="outlined">Reset</Button>
                <Button variant="outlined" onClick={() => navigate('/')}>Back</Button>
            </Box>
        </React.Fragment>
    );
}