import { GOOGLE_TOKENINFO_ENDPOINT } from "../../config/google";
import { ApiError } from "../../models/api_error";
import { AccessTokenInfo } from "../../models/tokeninfo";
import { User } from "../../models/user";
import { fetchJson } from "../fetch";
import { getAccessToken } from "../user";

export const postTokenInfo = async (user: User): Promise<boolean> => {
    const access_token = await getAccessToken(user);
    return fetchJson(`${GOOGLE_TOKENINFO_ENDPOINT}?access_token=${access_token}`, { method: 'POST' })
        .then(response => checkTokenInfoResponse(response.body as AccessTokenInfo))
        .catch(err => { throw err })
}

const checkTokenInfoResponse = async (tokenInfo: AccessTokenInfo): Promise<boolean> => {
    if (tokenInfo.expires_in > 0) return true;
    throw new ApiError("Unauthenticated request", new Error(), 403);
}