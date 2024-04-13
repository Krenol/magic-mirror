import { createContext, useMemo } from "react";
import { useGetUserSettings } from "../apis/user_settings";
import { useGetGeocode } from "../apis/geocode";

type LocationContextType = { longitude: number; latitude: number };

const defaultValue: LocationContextType = { longitude: 0, latitude: 0 };

const LocationContext = createContext(defaultValue);

const LocationContextProvider = ({ children }: { children: JSX.Element }) => {
  const { data: userSettings } = useGetUserSettings(false);
  const queryParams = useMemo(
    () => [
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
    ],
    [userSettings?.city, userSettings?.country, userSettings?.zip_code]
  );

  const { data: geoLocation } = useGetGeocode(queryParams);

  const value = useMemo(
    () => ({
      longitude: geoLocation?.longitude ?? 0,
      latitude: geoLocation?.latitude ?? 0,
    }),
    [geoLocation?.latitude, geoLocation?.longitude]
  );

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export { LocationContext, LocationContextProvider };
