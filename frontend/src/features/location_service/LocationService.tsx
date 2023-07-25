import { useEffect } from "react";
import { useGetUserSettings } from "../../apis/user_settings";
import { useGetGeocode } from "../../apis/geocode";
import { setLocation } from "./locationSlice";
import { useAppDispatch } from "../../helpers/hooks";

export const LocationService = () => {
  const dispatch = useAppDispatch();
  const { data: userSettings } = useGetUserSettings(true);
  const { data: location } = useGetGeocode([
    {
      name: "city",
      value: userSettings?.city ?? "",
    },
    {
      name: "country",
      value: userSettings?.country ?? "",
    },
    {
      name: "zip_code",
      value: userSettings?.zip_code ?? "",
    },
  ]);
  useEffect(() => {
    if (location) {
      dispatch(
        setLocation({
          longitude: location.latitude,
          latitude: location.longitude,
        })
      );
    }
  }, [location, dispatch]);

  return null;
};
