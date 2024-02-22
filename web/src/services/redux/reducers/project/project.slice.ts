import {BasicApiResponse, ProjectDetails} from "../../../../typings/api";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import ProjectService from "../../../../api/service/project-service/project-service";

export type ProjectSliceState = {
    isLoading: boolean;
    payload: BasicApiResponse<ProjectDetails>;
};

const initialState: ProjectSliceState = {
    isLoading: false,
    payload: { code: "", content: {description: "", latitude: 0, longitude: 0, name: ""}, errors: [], warnings: [] },
};

export const createProject = createAsyncThunk('createProject', async (createProjectResp: ProjectDetails, thunkAPI) => {
    const response = await ProjectService.createProject(createProjectResp);
    return response?.content;
});

export const authSlice = createSlice({
    name: 'authSlice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(createProject.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(createProject.fulfilled, (state, { payload }) => {
            state = { payload, isLoading: false};
            return state;
        });
        builder.addCase(createProject.rejected, (state, errors) => {
            state.isLoading = false;
        });
    },
});
