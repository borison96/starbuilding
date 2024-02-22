import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import UserService from '../../../../api/service/user-service/user-service';
import {AuthenticationResponse, BasicApiResponse, User} from '../../../../typings/api';

export type UserState = {
    isLoading: boolean;
    response: BasicApiResponse<User | null>;
};

const initialState: UserState = {
    isLoading: false,
    response: { code: "", content: null, errors: [], warnings: [] },
};

export const getCurrentUserInfo = createAsyncThunk('get-current-user', async (thunkApi) => {
    const response = await UserService.getMe();
    return response;
});

export const getCurrentUserSlice = createSlice({
    name: 'getCurrentUserSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getCurrentUserInfo.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(getCurrentUserInfo.fulfilled, (state, { payload }) => {
            state = { response: payload, isLoading: false };
            return state;
        });
        builder.addCase(getCurrentUserInfo.rejected, (state) => {
            state.isLoading = false;
        });
    },
});

