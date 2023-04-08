import { GOOGLE_TOKENINFO_ENDPOINT } from "config/google";
import { ApiError } from "models/api/api_error";
import { AccessTokenInfo } from "models/api/tokeninfo";
import { GoogleUser } from "models/api/express_user";
import { getAccessToken } from "services/identity";
import { fetchJsonGoogleAuthRefresh } from "services/fetch";

export const postTokenInfo = async (user: GoogleUser): Promise<boolean> => {
    const access_token = await getAccessToken(user);
    return fetchJsonGoogleAuthRefresh(`${GOOGLE_TOKENINFO_ENDPOINT}?access_token=${access_token}`, { method: 'POST' }, user, GOOGLE_TOKENINFO_ENDPOINT)
        .then(response => checkTokenInfoResponse(response.body as AccessTokenInfo))
        .catch(err => { throw err })
}

const checkTokenInfoResponse = async (tokenInfo: AccessTokenInfo): Promise<boolean> => {
    if (tokenInfo.expires_in > 0) return true;
    throw new ApiError("Unauthenticated request", new Error(), 401);
}