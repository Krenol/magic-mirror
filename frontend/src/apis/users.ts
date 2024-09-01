import { USER_SETTINGS_API } from '../constants/api'
import { fetchJson } from '../common/fetch'
import { UserSettings } from '../models/user_settings'

export const postUserSettings = async (
    country: string,
    city = '',
    zipCode = ''
) => {
    return getUserSettingsBody(country, city, zipCode)
        .then((settings) => JSON.stringify(settings))
        .then((settings) =>
            fetchJson(
                USER_SETTINGS_API,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: settings,
                },
                [201]
            )
        )
}

export const patchUserSettings = async (
    country?: string,
    city?: string,
    zipCode?: string
) => {
    return getUserSettingsBody(country, city, zipCode)
        .then((settings) => JSON.stringify(settings))
        .then((settings) =>
            fetchJson(
                `${USER_SETTINGS_API}/me`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: settings,
                },
                [200]
            )
        )
}

const getUserSettingsBody = async (
    country?: string,
    city?: string,
    zipCode?: string
): Promise<Partial<UserSettings>> => {
    return {
        zip_code: zipCode,
        country: country,
        city: city,
    }
}
