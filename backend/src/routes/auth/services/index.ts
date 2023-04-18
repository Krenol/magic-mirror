import { GOOGLE_TOKENINFO_ENDPOINT, GOOGLE_USER_INFO_ENDPOINT } from "config";
import { ApiError } from "models/api/api_error";
import { AccessTokenInfo } from "models/api/tokeninfo";
import { getAccessToken, getAuthenticationHeader } from "services/identity/user";
import { fetchJsonGoogleAuthRefresh } from "services/fetch";
import { IDtoUser } from "models/mongo/users";
import { TResponse } from "models/api/fetch";

export const postTokenInfo = async (user: IDtoUser): Promise<boolean> => {
    const access_token = await getAccessToken(user);
    return fetchJsonGoogleAuthRefresh(`${GOOGLE_TOKENINFO_ENDPOINT}?access_token=${access_token}`, user, { method: 'POST' }, GOOGLE_TOKENINFO_ENDPOINT)
        .then(response => checkTokenInfoResponse(response.body as AccessTokenInfo))
        .catch(err => { throw err })
}

const checkTokenInfoResponse = async (tokenInfo: AccessTokenInfo): Promise<boolean> => {
    if (tokenInfo.expires_in > 0) return true;
    throw new ApiError("Unauthenticated request", new Error(), 401);
}

export const getUserInfo = async (user: IDtoUser): Promise<boolean> => {
    const authHeader = await getAuthenticationHeader(user);
    return fetchJsonGoogleAuthRefresh(GOOGLE_USER_INFO_ENDPOINT, user, authHeader)
        .then(response => checkUserInfoResponse(response))
        .catch(err => { throw err })
}

const checkUserInfoResponse = async (response: TResponse): Promise<boolean> => {
    if (response.status === 200) return true;
    throw new ApiError("Unauthenticated request", new Error(), 401);
}