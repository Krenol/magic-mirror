import { Request, Response } from 'express';
import { OPENWEATHER_URL } from 'config';
import { ApiError } from 'models/api/api_error';
import { ApiResponse } from 'models/api/fetch';

export const buildWeatherIconUrl = async (req: Request): Promise<string> => {
  return `${OPENWEATHER_URL}/img/wn/${req.params.weatherCode}.png`;
};

export const handleWeatherIconResponse = async (
  res: Response,
  apiResponse: ApiResponse<ArrayBuffer>,
): Promise<Response> => {
  if (apiResponse.status === 200) {
    return createIconResponse(res, apiResponse.body);
  } else if (apiResponse.status === 404) {
    throw new ApiError('Icon not found!', new Error(), 404);
  } else {
    throw new ApiError('Error while retrieving the weather icon', new Error(), 500);
  }
};

const createIconResponse = async (res: Response, response: ArrayBuffer): Promise<Response> => {
  res.header({ 'Content-Type': 'image/png' }).write(Buffer.from(response));
  return res.end();
};
