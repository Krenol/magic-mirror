import { Box } from '@mui/material';
import SessionCheck from '../features/auth/AuthHelper';
import { logout } from "../apis/logout"
import { SettingsForm } from '../features/settings_form/SettingsForm';
import { useNavigate } from 'react-router-dom';
import { useGetUserSettings } from '../apis/user_settings';
import { patchUserSettings } from '../apis/users';

export const Settings = () => {
    const navigate = useNavigate();

    const {
        data: userSettings,
        isLoading,
        error,
        refetch
    } = useGetUserSettings(false);

    const updateSettings = (country: string, city: string, zipCode: string) => {
        if (inputHasChanged(country!, city!, zipCode!)) {
            patchUserSettings(country!, city!, zipCode!)
                .then(() => refetch())
                .catch(alert);
        }
    }

    const inputHasChanged = (country: string, city: string, zipCode: string): boolean => {
        return country !== userSettings?.country || city !== userSettings?.city || zipCode !== userSettings?.zip_code;
    }

    const back = () => navigate('/');

    if (isLoading) return <Box>Loading...</Box>;
    if (error) return <Box>Error</Box>;
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <SessionCheck onUnauthenticated={logout} refetchInterval={0} />
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