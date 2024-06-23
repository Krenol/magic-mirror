import { createContext, useEffect, useState } from "react";
import { useGetUserSettings } from "../apis/user_settings";
import { useGetGeocode } from "../apis/geocode";
import { QueryParameters } from "../models/apis";
import { GeoLocation } from "../models/location";

type LocationContextType = { longitude: number; latitude: number };

const defaultValue: LocationContextType = { longitude: 0, latitude: 0 };

const LocationContext = createContext(defaultValue);

const LocationContextProvider = ({ children }: { children: JSX.Element }) => {
  const { data: userSettings } = useGetUserSettings(false);
  const [queryParameters, setQueryParameters] = useState<QueryParameters>([]);
  const [geoLocation, setGeoLocation] = useState<GeoLocation>({
    longitude: 0,
    latitude: 0,
  });
  const { data: apiGeoLocation } = useGetGeocode(queryParameters);
  useEffect(() => {
    setQueryParameters([
      {
        name: "city",
        value: userSettings?.city,
      },
      {
        name: "country",
        value: userSettings?.country,
      },
      {
        name: "zip_code",
        value: userSettings?.zip_code,
      },
    ]);
  }, [userSettings?.city, userSettings?.country, userSettings?.zip_code]);

  useEffect(() => {
    if (apiGeoLocation) {
      setGeoLocation(apiGeoLocation);
    }
  }, [apiGeoLocation, setGeoLocation]);

  return (
    <LocationContext.Provider value={geoLocation}>
      {children}
    </LocationContext.Provider>
  );
};

export { LocationContext, LocationContextProvider };
