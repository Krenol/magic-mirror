import { setLocation } from "./locationSlice";
import { fetchJson } from "../../helpers/fetch";
import { LOCATION_API, USER_SETTINGS_API } from "../../constants/api";
import { buildQuery } from "../../helpers/apis";
import { store } from "../../helpers/store";

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
  store.dispatch(setLocation(geoLocation));
  return null;
};
