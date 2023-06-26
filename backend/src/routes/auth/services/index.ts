import { GOOGLE_USER_INFO_ENDPOINT } from "config";
import { ApiError } from "models/api/api_error";
import { fetchJsonGoogleAuthRefresh } from "services/fetch";
import { IDtoUser } from "models/mongo/users";
import { TResponse } from "models/api/fetch";

export const getUserInfo = async (user: IDtoUser): Promise<boolean> => {
    return fetchJsonGoogleAuthRefresh(GOOGLE_USER_INFO_ENDPOINT, user)
        .then(response => checkUserInfoResponse(response))
        .catch(err => { throw err })
}

const checkUserInfoResponse = async (response?: TResponse): Promise<boolean> => {
    if (response?.status === 200) return true;
    throw new ApiError("Unauthenticated request", new Error(), 401);
}