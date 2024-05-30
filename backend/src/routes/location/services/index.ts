import { GEOCODE_URL } from "config";
import { Request, Response } from "express";
import { ApiError } from "models/api/api_error";
import { TResponse } from "models/api/fetch";
import { GeocodeResponse } from "models/api/geocode";

type QueryParam = {
  name: string;
  value: string;
};
export const buildGeocodeUrl = async (req: Request) => {
  const queryList: Array<QueryParam> = [
    {
      name: "country",
      value: req.query["country"] as string,
    },
  ];
  if (req.query["zip_code"]) {
    queryList.push({
      name: "postalcode",
      value: req.query["zip_code"] as string,
    });
  }
  if (req.query["city"]) {
    queryList.push({
      name: "city",
      value: req.query["city"] as string,
    });
  }
  const queryParams = queryList
    .map((val) => `${val.name}=${val.value}`)
    .join("&");
  return `${GEOCODE_URL}/search?${queryParams}`;
};

export const handleGeocodeResponse = async (
  res: Response,
  response: TResponse
) => {
  if (response.body.length === 0) {
    throw new ApiError(
      response.body.reason ?? "Geolocation could not be found",
      new Error(),
      404
    );
  }
  const responseBody = response.body as Array<GeocodeResponse>;
  const bestMatch = responseBody.reduce((prev, current) => {
    return current.importance > prev.importance ? current : prev;
  });
  res.status(200).json({
    longitude: bestMatch.lon,
    latitude: bestMatch.lat,
  });
};
