import { createSlice } from '@reduxjs/toolkit';

interface ToasterState {
    isVisible: boolean;
    errors: boolean;
    message: string;
    title: string;
}

export const initialState: ToasterState = {
    isVisible: false,
    errors: false,
    message: '',
    title: '',
};

export const toasterSlice = createSlice({
    name: 'toaster',
    initialState,
    reducers: {
        setToasterVisible: (state = initialState, { payload }) => {
            state.isVisible = true;
            state.message = payload.message;
            state.title = payload.title;
            state.errors = false;
        },
        setToasterGone: (state) => {
            state.isVisible = false;
        },
        setToasterError: (state = initialState, { payload }) => {
            state.errors = true;
            state.title = payload.title;
            state.message = payload.message;
            state.isVisible = true;
        },
    },
});

export const { setToasterGone, setToasterVisible, setToasterError } = toasterSlice.actions;
export default toasterSlice.reducer;
