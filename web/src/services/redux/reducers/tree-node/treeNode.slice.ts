import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ActiveNodesType, TreeNodeType } from "../../../../typings";
import { ProjectDetails } from "../../../../typings/api";

export interface TreeNodeActivityType {
    auto_select_node_by_type: boolean;
}
export interface TreeNodeState {
    project: ProjectDetails & { index: number } | null;
    activeNode: TreeNodeType | null;
    activeNodePath: ActiveNodesType | null;
    activities: TreeNodeActivityType;
};

const initialState: TreeNodeState = {
    project: null,
    activeNode: null,
    activeNodePath: null,
    activities: {
        auto_select_node_by_type: true,
    },
};

const treeNodeSlice = createSlice({
    name: 'tree-node-slice',
    initialState,
    reducers: {
        selectProject: (state, action: PayloadAction<ProjectDetails & { index: number } | null>) => {
            state.project = action.payload;
        },
        setActiveNode: (state, action: PayloadAction<TreeNodeType | null>) => {
            state.activeNode = action.payload;
        },
        setActiveNodePath: (state, action: PayloadAction<ActiveNodesType | null>) => {
            state.activeNodePath = action.payload;
        },
        enableNodeActivity: (state, action: PayloadAction<keyof TreeNodeActivityType>) => {
            state.activities[action.payload] = true;
        },
        disableNodeActivity: (state, action: PayloadAction<keyof TreeNodeActivityType>) => {
            state.activities[action.payload] = false;
        },
    }
});

export const { selectProject, setActiveNode, setActiveNodePath, enableNodeActivity, disableNodeActivity } = treeNodeSlice.actions;

export default treeNodeSlice.reducer;
