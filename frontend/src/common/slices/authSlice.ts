import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface AuthState {
  value: boolean;
}

const initialState: AuthState = {
  value: false,
};

export const authSlice = createSlice({
  name: "auth_status",
  initialState,
  reducers: {
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

export const { setAuthenticated } = authSlice.actions;

export const getAuthStatus = (state: RootState) => state.auth_status.value;

export default authSlice.reducer;
