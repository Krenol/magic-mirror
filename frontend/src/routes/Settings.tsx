import { useRef, useState } from 'react';
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
    const city = useRef<HTMLInputElement>();
    const zip = useRef<HTMLInputElement>();

    const sendData = () => {
        if (country === "") {
            alert("Country must not be empty!");
        } else if (city.current?.value === "") {
            alert("City must not be empty!");
        } else if (zip.current?.value === "") {
            alert("Zip code must not be empty!");
        } else {
            setUserData({
                countryCode: country,
                city: city.current!.value,
                zip: zip.current!.value
            });
            console.log(userData);
            //back();
        }
    }

    const back = () => navigate('/');

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                p: 4,
                width: '50ch'
            }}
            >
                <SessionCheck onUnauthenticated={logout} />
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <CountrySelect inputCallback={setCountry} defaultCityCode={userData.countryCode} />
                </Box>
                <Box
                    component="form"
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 4,
                        justifyContent: 'center'
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <TextField id="city" label="City" variant="outlined" inputRef={city} defaultValue={userData.city} />
                    <TextField id="zip" label="Zip Code" variant="outlined" inputRef={zip} defaultValue={userData.zip} />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
                    <Button variant="outlined" onClick={sendData}>Send</Button>
                    <Button variant="outlined" onClick={back}>Back</Button>
                </Box>
            </Box>
        </Box>
    );
}