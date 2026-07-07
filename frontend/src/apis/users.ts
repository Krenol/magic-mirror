import { UserSettings } from '../models/user_settings'
import { SettingsParams } from '../components/settings_form/SettingsForm'
import { getItem, setItem } from '../services/localStorage'
import { queryClient } from '../common/queryClient'
import { ServerStateKeysEnum } from '../common/statekeys'

const STORAGE_KEY = 'magic-mirror.user-settings'

export const putUserSettings = async (
    data: SettingsParams
): Promise<UserSettings> => {
    // widget_layout isn't part of the settings form (Dashboard patches it
    // separately), so preserve whatever is already stored for it.
    const existing = getItem<UserSettings>(STORAGE_KEY)
    const settings = {
        ...getUserSettingsBody(data),
        widget_layout: existing?.widget_layout,
    }
    setItem(STORAGE_KEY, settings)
    queryClient.setQueryData([ServerStateKeysEnum.user_settings], settings)
    return settings
}

const getUserSettingsBody = (data: SettingsParams): UserSettings => {
    return {
        zip_code: data.zipCode,
        country: data.country,
        city: data.city,
        events_cal_id: data.eventsCalId,
        birthday_cal_id: data.birthdayCalId,
        train_connections: data.trainConnections,
        train_display_settings: {
            mode: data.trainDisplaySettings?.mode || 'carousel',
            carousel_interval:
                data.trainDisplaySettings?.carousel_interval || 15,
        },
    }
}
