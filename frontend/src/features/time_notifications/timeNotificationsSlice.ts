import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../helpers/store";

export interface TimeState {
  newDay: boolean;
  newHour: boolean;
}

const initialState: TimeState = {
  newDay: false,
  newHour: false,
};

export const timeSlice = createSlice({
  name: "time_notifications",
  initialState,
  reducers: {
    setIsNewDay: (state, action: PayloadAction<boolean>) => {
      state.newDay = action.payload;
    },
    setIsNewHour: (state, action: PayloadAction<boolean>) => {
      state.newHour = action.payload;
    },
  },
});

export const { setIsNewDay, setIsNewHour } = timeSlice.actions;

export const isNewDay = (state: RootState) => state.time_notifications.newDay;
export const isNewHour = (state: RootState) => state.time_notifications.newHour;

export default timeSlice.reducer;
