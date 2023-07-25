import { Response, Request } from "express";
import { OPENWEATHER_URL } from "config";
import { TResponse } from "models/api/fetch";
import { ApiError } from "models/api/api_error";

export const buildWeatherIconUrl = async (req: Request): Promise<string> => {
  return `${OPENWEATHER_URL}/img/wn/${req.params.weatherCode}.png`;
};

export const handleWeatherIconResponse = async (
  res: Response,
  response: TResponse,
): Promise<any> => {
  if (response.status === 200) {
    return createIconResponse(res, response.body);
  } else if (response.status === 404) {
    throw new ApiError("Icon not found!", new Error(), 404);
  } else {
    throw new ApiError(
      "Error while retrieving the weather icon",
      new Error(),
      500,
    );
  }
};

const createIconResponse = async (
  res: Response,
  response: any,
): Promise<Response> => {
  res.header({ "Content-Type": "image/png" }).write(Buffer.from(response));
  return res.end();
};
