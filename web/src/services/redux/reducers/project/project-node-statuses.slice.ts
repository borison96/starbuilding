import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import ProjectService from "../../../../api/service/project-service/project-service";

export type TreeState = {
    isLoading: boolean;
    payload?: Array<{ [key: string]: any }> | undefined;
};
const initialState: TreeState = {
    isLoading: false,
};

export const loadProjectNodeStatuses = createAsyncThunk('projects/nodeStatuses', ProjectService.loadNodeStatuses);

const nodeTypesSlice = createSlice({
    name: 'project-node-types',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(loadProjectNodeStatuses.pending, () => ({ isLoading: true }));
        builder.addCase(loadProjectNodeStatuses.fulfilled, (state, { payload }) => ({ 
            isLoading: false,
            payload,
        }));
        builder.addCase(loadProjectNodeStatuses.rejected, () => ({ isLoading: false }) )
    },
});

export default nodeTypesSlice.reducer;
