import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import ProjectService from "../../../../api/service/project-service/project-service";

export type TreeState = {
    isLoading: boolean;
    payload?: Array<{ [key: string]: any }> | undefined;
};
const initialState: TreeState = {
    isLoading: false,
};

export const loadProjectNodeTypes = createAsyncThunk('projects/nodeTypes', ProjectService.loadNodeTypes);

const nodeTypesSlice = createSlice({
    name: 'project-node-types',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(loadProjectNodeTypes.pending, () => ({ isLoading: true }));
        builder.addCase(loadProjectNodeTypes.fulfilled, (state, { payload }) => ({ 
            isLoading: false,
            payload,
        }));
        builder.addCase(loadProjectNodeTypes.rejected, () => ({ isLoading: false }) );
    },
});

export default nodeTypesSlice.reducer;
