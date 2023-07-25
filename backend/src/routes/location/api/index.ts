import { NextFunction, Request, Response } from "express";
import { fetchJson } from "services/fetch";
import { ApiError } from "models/api/api_error";
import { buildGeocodeUrl, handleGeocodeResponse } from "../services";

export const getGeocodeOfAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return buildGeocodeUrl(req)
    .then((url) => fetchJson(url))
    .then((response) => handleGeocodeResponse(res, response))
    .catch((err: ApiError) => next(err));
};
