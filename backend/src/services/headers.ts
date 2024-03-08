import { IncomingHttpHeaders } from "http2";

const getUserId = async (headers: IncomingHttpHeaders) => {
  return headers["x-forwarded-user"] as string;
};

const getUserEmail = async (headers: IncomingHttpHeaders) => {
  return headers["x-forwarded-email"] as string;
};

const getAccessToken = async (headers: IncomingHttpHeaders) => {
  return headers["x-forwarded-access-token"] as string;
};

export const getAuthenticationHeader = async (
  headers: IncomingHttpHeaders
): Promise<RequestInit> => {
  return getAccessToken(headers).then((access_token) => ({
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  }));
};

export { getUserId, getUserEmail, getAccessToken };
