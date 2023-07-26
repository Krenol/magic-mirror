import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { UserSettings } from "../../models/user_settings";

const initialState: UserSettings = {
  country: "DE",
};

export const userSettingsSlice = createSlice({
  name: "user_settings",
  initialState,
  reducers: {
    setUserSettings: (state, action: PayloadAction<UserSettings>) => {
      state.country = action.payload.country;
      state.city = action.payload.city;
      state.zip_code = action.payload.zip_code;
    },
  },
});

export const { setUserSettings } = userSettingsSlice.actions;

export const getUserSettings = (state: RootState) => state.user_settings;

export default userSettingsSlice.reducer;
