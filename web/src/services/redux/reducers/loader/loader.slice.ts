import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { type } from 'os';

export type LoaderState = {
    loading?: boolean;
    text?: string;
    el?: string | HTMLElement;
    hasBackDrop?: boolean;
    textStyle?: string;
    backDropStyle?: string;
}
const initialState: LoaderState = {
  loading: false,
};
export const loaderSlice = createSlice({
  name: 'loader',
  initialState,
  reducers: {
    startLoading: (state, action: PayloadAction<LoaderState|undefined>) => {
      if (typeof action.payload !== 'undefined') {
        return { ...action.payload, loading: true };
      }
      return { loading: true };
    },
    stopLoading: () => ({ loading: false }),
  },
});

export const { startLoading, stopLoading } = loaderSlice.actions;

export default loaderSlice.reducer;
