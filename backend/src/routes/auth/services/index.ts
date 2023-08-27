import { FAILURE_REDIRECT_URI, GOOGLE_USER_INFO_ENDPOINT } from "config";
import { ApiError } from "models/api/api_error";
import { fetchJsonGoogleAuthRefresh } from "services/fetch";
import { IDtoUser } from "models/mongo/users";
import { TResponse } from "models/api/fetch";
import { NextFunction, Request, Response } from "express";
import {
  UNREGISTERED,
  USER_ALREADY_REGISTERED,
} from "services/identity/errors";

export const getUserInfo = async (user: IDtoUser): Promise<boolean> => {
  return fetchJsonGoogleAuthRefresh(GOOGLE_USER_INFO_ENDPOINT, user)
    .then((response) => checkUserInfoResponse(response))
    .catch((err) => {
      throw err;
    });
};

const checkUserInfoResponse = async (
  response?: TResponse
): Promise<boolean> => {
  if (response?.status === 200) return true;
  throw new ApiError("Unauthenticated request", new Error(), 401);
};

export const authErrorHandler = async (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  let error = "unknown";
  switch (err) {
    case USER_ALREADY_REGISTERED:
      error = "already_registered";
      break;
    case UNREGISTERED:
      error = "not_registered";
      break;
    default:
      break;
  }
  return res.redirect(`${FAILURE_REDIRECT_URI}?type=${error}`);
};
