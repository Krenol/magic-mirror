import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import timeReducer from "../features/time_notifications/timeNotificationsSlice";
import locationReducer from "../features/location_loader/locationSlice";

export const store = configureStore({
  reducer: {
    auth_status: authReducer,
    time_notifications: timeReducer,
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
