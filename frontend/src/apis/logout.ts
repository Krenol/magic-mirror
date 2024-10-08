import { LOGOUT_URL, DEFAULT_FETCH_CONFIG } from '../constants/api'
import { APP_BASE_URL } from '../constants/defaults'

export const logout = async () => {
    const object: RequestInit = { method: 'POST', redirect: 'follow' }
    fetch(LOGOUT_URL, { ...object, ...DEFAULT_FETCH_CONFIG })
        .then(() => (window.location.href = APP_BASE_URL))
        .catch(() => {
            window.location.href = APP_BASE_URL
        })
}
