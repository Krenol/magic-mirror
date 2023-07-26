import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import timeReducer from "./slices/timeNotificationsSlice";
import locationReducer from "./slices/locationSlice";
import userSettingsReducer from "./slices/userSettingsSlice";

export const store = configureStore({
  reducer: {
    auth_status: authReducer,
    time_notifications: timeReducer,
    location: locationReducer,
    user_settings: userSettingsReducer,
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
