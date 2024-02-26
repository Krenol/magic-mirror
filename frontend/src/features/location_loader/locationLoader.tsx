import { setLocation } from "../../common/slices/locationSlice";
import { fetchJson } from "../../common/fetch";
import { LOCATION_API, USER_SETTINGS_API } from "../../constants/api";
import { buildQuery } from "../../common/apis";
import { store } from "../../common/store";
import { setUserSettings } from "../../common/slices/userSettingsSlice";

const getUserSettings = async () => {
  return fetch(`${USER_SETTINGS_API}/me`)
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else if (res.status === 404) {
        window.location.href = "/registration";
      } else {
        window.location.href = "/";
      }
    })
    .catch(() => (window.location.href = "/"));
};

export const locationLoader = async () => {
  try {
    const userSettings = await getUserSettings();

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
  } catch (err) {
    window.location.href = "/";
  }
  return null;
};
