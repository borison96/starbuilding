import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import EmailService from "../../../../api/service/email-service/email-service";
import {BasicApiResponse} from "../../../../typings/api";
import {Role} from "../../../../domain/domain";

export type RoleState =  {
    isLoading: boolean;
    response: BasicApiResponse<Role | null>;
}
const initialState: RoleState = {
    isLoading: false,
    response: { code: "", content: null, errors: [], warnings: [] },
};


export const getRoleList = createAsyncThunk('get/role-list', EmailService.getRoleList);

/*
export const rolesSlice = createSlice({
    name: 'rolesSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getRoleList.pending, () => ({ isLoading: true }));
        builder.addCase(getRoleList.fulfilled, (state, { payload }) => ({
            isLoading: false,
            payload,
        }));
        builder.addCase(getRoleList.rejected, () => ({ isLoading: false }) )
    },
});*/
