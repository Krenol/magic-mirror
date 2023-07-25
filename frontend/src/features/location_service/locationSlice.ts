import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../helpers/store";
import { GeoLocation } from "../../models/location";

const initialState: GeoLocation = {
  longitude: 0,
  latitude: 0,
};

export const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setLocation: (state, action: PayloadAction<GeoLocation>) => {
      state.longitude = action.payload.longitude;
      state.latitude = action.payload.latitude;
    },
  },
});

export const { setLocation } = locationSlice.actions;

export const getLocation = (state: RootState) => state.location;

export default locationSlice.reducer;
