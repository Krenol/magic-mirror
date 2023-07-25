import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import timeReducer from "../features/time/timeSlice";
import locationReducer from "../features/location_service/locationSlice";

export const store = configureStore({
  reducer: {
    auth_status: authReducer,
    time_status: timeReducer,
    location: locationReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
