import { APP_BASE_URL } from '../constants/defaults'
import { signOut } from '../services/googleAuth'

export const logout = async () => {
    signOut()
    window.location.href = APP_BASE_URL
}
