import { Box } from '@mui/material';
import SessionCheck from '../features/auth/AuthHelper';
import { logout } from "../apis/logout"
import { SettingsForm } from '../features/settings_form/SettingsForm';
import { useNavigate } from 'react-router-dom';
import { useGetUserSettings } from '../apis/user_settings';
import { fetchJson } from '../app/fetch';
import { USER_SETTINGS_API } from '../constants/api';
import { UserSettings } from '../models/user_settings';

export const Settings = () => {
    const navigate = useNavigate();

    const {
        data: userSettings,
        isLoading,
        error,
        refetch
    } = useGetUserSettings();

    const updateSettings = (country?: string, city?: string, zipCode?: string) => {
        if (country === "") {
            alert("Country must not be empty!");
        } else if (city === "") {
            alert("City must not be empty!");
        } else if (zipCode === "") {
            alert("Zip code must not be empty!");
        } else {
            patchNewUserSettings(country!, city!, zipCode!)
                .then(() => refetch())
                .catch(alert);
        }
    }

    const patchNewUserSettings = async (country: string, city: string, zipCode: string) => {
        return getNewUserSettingsBody(country, city, zipCode)
            .then(settings => JSON.stringify(settings))
            .then(settings =>
                fetchJson(USER_SETTINGS_API, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: settings
                }, [200])
            );
    }

    const getNewUserSettingsBody = async (country: string, city: string, zipCode: string): Promise<UserSettings> => {
        return {
            zip_code: zipCode,
            country: country,
            city: city
        }
    }

    const back = () => navigate(-1);

    if (isLoading) return <Box>Loading...</Box>;
    if (error) return <Box>Error</Box>;
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <SessionCheck onUnauthenticated={logout} />
            <SettingsForm
                defaultCity={userSettings?.city}
                defaultCountry={userSettings?.country}
                defaultZipCode={userSettings?.zip_code}
                onBack={back}
                showBackButton={true}
                onSend={updateSettings}
            />
        </Box>
    );
}