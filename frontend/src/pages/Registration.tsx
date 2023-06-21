import { Box } from '@mui/material';
import { SettingsForm } from '../features/settings_form/SettingsForm';
import { useNavigate } from 'react-router-dom';
import { fetchJson } from '../app/fetch';
import { USER_SETTINGS_API } from '../constants/api';
import { UserSettings } from '../models/user_settings';
import SessionCheck from '../features/auth/AuthHelper';
import { logout } from '../apis/logout';
import { useGetUserSettings } from '../apis/user_settings';
import { useEffect } from 'react';

export const Registration = () => {
    const navigate = useNavigate();
    const {
        data: userSettings,
        isLoading,
        error,
    } = useGetUserSettings();

    useEffect(() => {
        if (userSettings && userSettings.city) {
            navigate('/settings');
        }
    }, [userSettings, navigate]);

    const addUserSettings = (country?: string, city?: string, zipCode?: string) => {
        if (country === "") {
            alert("Country must not be empty!");
        } else if (city === "") {
            alert("City must not be empty!");
        } else if (zipCode === "") {
            alert("Zip code must not be empty!");
        } else {
            postNewUserSettings(country!, city!, zipCode!)
                .then(() => navigate('/login'))
                .catch(alert);
        }
    }

    const postNewUserSettings = async (country: string, city: string, zipCode: string) => {
        return getNewUserSettingsBody(country, city, zipCode)
            .then(setts => JSON.stringify(setts))
            .then(setts =>
                fetchJson(USER_SETTINGS_API, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: setts
                }, [201])
            );
    }

    const getNewUserSettingsBody = async (country: string, city: string, zipCode: string): Promise<UserSettings> => {
        return {
            zip_code: zipCode,
            country: country,
            city: city
        }
    }

    if (isLoading) return <Box>Loading...</Box>;
    if (error) {
        navigate('/login');
        return <Box>Error!</Box>;
    }
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <SessionCheck onUnauthenticated={logout} />
            <SettingsForm
                showBackButton={false}
                onSend={addUserSettings}
            />
        </Box>
    );
}