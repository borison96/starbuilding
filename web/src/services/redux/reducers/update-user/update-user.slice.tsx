import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import UserService from '../../../../api/service/user-service/user-service';
import { User, BasicApiResponse } from "../../../../typings/api";

export type CreateUserType = {
    email: string;
    lastname: string;
    firstname: string;
    password?: string;
    roles: string[];
    responsibleId?: number;
};

export type UserUpdateState = {
    isLoading: boolean;
    isRejected: boolean;
    errorMessage: string;
    successMessage: string;
    payload: BasicApiResponse<User>;
};

const initialUserUpdateState: UserUpdateState = {
    isLoading: false,
    isRejected: false,
    errorMessage: '',
    successMessage: '',
    payload: { content: null, errors: [], warnings: [], code: '' },
};

type GetUserData = {
    userId: number,
    createUserForm: CreateUserType,
};

export const updateUser = createAsyncThunk('update/create', async (data: GetUserData, thunkApi) => {
    const response = await UserService.updateUser(data.userId,data.createUserForm);
    return response;
});

const updateUserSlice = createSlice({
    name: 'updateUserSlice',
    initialState: initialUserUpdateState,
    reducers: {
        resetUpdateUser: (state) => {
            state = initialUserUpdateState;
            return state;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(updateUser.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(updateUser.fulfilled, (state, { payload }) => {
            // @ts-ignore
            state.payload = payload;
            state.isLoading = false;
            state.isRejected= false;
            state.errorMessage = '';
            state.successMessage= 'requête resussi avec succes';
            //return state;
        });
        builder.addCase(updateUser.rejected, (state) => {
            state.isLoading = false;
            state.isRejected = true;
            state.successMessage = '';
            state.errorMessage = 'Erreur lors de la requête';
            state.isLoading = false;
        });
    },
});

export const { resetUpdateUser } = updateUserSlice.actions;
export default updateUserSlice.reducer;
