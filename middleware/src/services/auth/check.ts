import { GOOGLE_TOKENINFO_ENDPOINT } from "../../config/google";
import { ApiError } from "../../models/api_error";
import { AccessTokenInfo } from "../../models/tokeninfo";
import { GoogleUser } from "../../models/express_user";
import { fetchJsonGoogleAuthRefresh } from "../fetch";
import { getAccessToken } from "../user";

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