import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AuthenticationResponse, BasicApiResponse, User} from '../../../../typings/api';
import EmailService from "../../../../api/service/email-service/email-service";

export type getInvitationData = {
    invitations: sendInvitationType,
    id: number
}
export type sendInvitationType = {
    invitations: UserRole[];
};

export type UserRole = {
    email: string;
    roleId: number;
}

export type UserState = {
    isLoading: boolean;
    response: BasicApiResponse<User | null>;
};

const initialState: UserState = {
    isLoading: false,
    response: { code: "", content: null, errors: [], warnings: [] },
};

export const sendMail = createAsyncThunk('send/email', async (data:getInvitationData, thunkApi) => {
    const response = await EmailService.sendEmail(data.id, data.invitations);
    return response;
});

export const sendInvitationSlice = createSlice({
    name: 'sendInvitationSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(sendMail.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(sendMail.fulfilled, (state, { payload }) => {
            state = { response: payload, isLoading: false };
            return state;
        });
        builder.addCase(sendMail.rejected, (state) => {
            state.isLoading = false;
        });
    },
});