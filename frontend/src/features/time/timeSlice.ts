import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, } from '../../app/store';

export interface TimeState {
  newDay: boolean;
}

const initialState: TimeState = {
  newDay: false
};

export const timeSlice = createSlice({
  name: 'time_status',
  initialState,
  reducers: {
    setNewDay: (state, action: PayloadAction<boolean>) => {
      state.newDay = action.payload;
    }
  }
});

export const { setNewDay } = timeSlice.actions;


export const isNewDay = (state: RootState) => state.time_status.newDay;


export default timeSlice.reducer;
