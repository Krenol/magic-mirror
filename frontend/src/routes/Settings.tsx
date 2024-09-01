import { Box } from '@mui/material'
import { SettingsForm } from '../components/settings_form/SettingsForm'
import { useNavigate } from 'react-router-dom'
import { useGetUserSettings } from '../apis/user_settings'
import { patchUserSettings } from '../apis/users'
import { useEffect } from 'react'

export const Settings = () => {
    const navigate = useNavigate()

    const {
        data: userSettings,
        isLoading,
        error,
        refetch,
    } = useGetUserSettings(false)

    useEffect(() => {
        if (userSettings?.city) {
            navigate('/registration')
        }
    }, [userSettings, navigate])

    const updateSettings = (
        country: string,
        city?: string,
        zipCode?: string
    ) => {
        if (inputHasChanged(country, city, zipCode)) {
            patchUserSettings(country, city, zipCode)
                .then(() => refetch())
                .catch(alert)
        }
    }

    const inputHasChanged = (
        country: string,
        city?: string,
        zipCode?: string
    ): boolean => {
        return (
            country !== userSettings?.country ||
            city !== userSettings?.city ||
            zipCode !== userSettings?.zip_code
        )
    }

    const back = () => navigate('/')

    if (isLoading) return <Box>Loading...</Box>

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <SettingsForm
                defaultCity={userSettings?.city}
                defaultCountry={userSettings?.country}
                defaultZipCode={userSettings?.zip_code}
                onBack={back}
                showBackButton={error == null}
                onSend={updateSettings}
            />
        </Box>
    )
}
