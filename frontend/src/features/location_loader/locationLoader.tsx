import { setLocation } from "../../common/slices/locationSlice";
import { fetchJson } from "../../common/fetch";
import { LOCATION_API, USER_SETTINGS_API } from "../../constants/api";
import { buildQuery } from "../../common/apis";
import { store } from "../../common/store";
import { setUserSettings } from "../../common/slices/userSettingsSlice";

export const locationLoader = async () => {
  const userSettings = await fetchJson(`${USER_SETTINGS_API}/me`);

  const queryParams = [
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
  ];
  const geoLocation = await buildQuery(queryParams)
    .then((qry) => fetchJson(`${LOCATION_API}/geocode${qry}`))
    .catch(() => {
      return {
        longitude: 0,
        latitude: 0,
      };
    });
  store.dispatch(setUserSettings(userSettings));
  store.dispatch(setLocation(geoLocation));
  return null;
};
