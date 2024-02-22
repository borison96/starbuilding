import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import ProjectService from "../../../../api/service/project-service/project-service";
import { KnowledgeNodeDatum, NewNodeDataType, ProjectKnowledgeSection } from "../../../../typings";
import { setScrollId } from "../kanban/kanban.slice";
import { updateKnowledgeBase } from "./projects.slice";

export type TreeState = {
    isLoading: boolean;
    payload?: KnowledgeNodeDatum;
};
const initialState: TreeState = {
    isLoading: false,
};

export const loadKnowledgeTree = createAsyncThunk('projects/tree', async (id: string | number, thunk) => {
    const { dispatch } = thunk;
    const tree = await ProjectService.loadKnowledgeTree(id);
    dispatch(updateKnowledgeBase({ id: Number(id), tree }));
    return tree;
});
export const addNodeToTree = createAsyncThunk('projects/tree/node',
    async ({id, node}: {id: string | number, node: NewNodeDataType}, thunk) => {
        const { dispatch } = thunk;
        const tree = await ProjectService.addNodeToTree(id, node);
        dispatch(updateKnowledgeBase({ id: Number(id), tree }));
        return tree;
    }
);
export const updateTreeNode = createAsyncThunk('projects/tree/node/update',
    async ({id, node}: {id: string | number, node: NewNodeDataType}, thunk) => {
        const { dispatch } = thunk;
        const tree = await ProjectService.updateNode(id, node);
        dispatch(updateKnowledgeBase({ id: Number(id), tree }));
        dispatch(setScrollId(tree?.attributes?.id));
        return tree;
    }
);
export const addNodeSection = createAsyncThunk('projects/tree/node/section', async ({projectId, nodeId, section }:
    { projectId: number | string, nodeId: number | string, section: Partial<ProjectKnowledgeSection> }, thunk) => {
    const { dispatch } = thunk;
    const tree = await ProjectService.addNodeSection(projectId, nodeId, section);
    dispatch(updateKnowledgeBase({ id: Number(projectId), tree }));
    dispatch(setScrollId(tree?.attributes?.id));
    return tree;
   }
);
export const addChildrenToNodeSection = createAsyncThunk('projects/tree/node/section/children', async ({projectId, nodeId, sectionId, chldren  }:
    { projectId: number | string; nodeId: number | string; sectionId: number | string; chldren: Array<string> }, thunk) => {
    const { dispatch } = thunk;
    const tree = await ProjectService.addChildrenToNodeSection(projectId, nodeId, sectionId, chldren);
    dispatch(updateKnowledgeBase({ id: Number(projectId), tree }));
    dispatch(setScrollId(tree?.attributes?.id));
    return tree;
   }
);
export const removeChildrenFromNodeSection = createAsyncThunk('projects/tree/node/section/children/remove', async ({projectId, nodeId, sectionId, chldren  }:
    { projectId: number | string; nodeId: number | string; sectionId: number | string; chldren: Array<string> }, thunk) => {
    const { dispatch } = thunk;
    const tree = await ProjectService.removeChildrenFromNodeSection(projectId, nodeId, sectionId, chldren);
    dispatch(updateKnowledgeBase({ id: Number(projectId), tree }));
    dispatch(setScrollId(tree?.attributes?.id));
    return tree;
   }
);
export const moveChildrenBetweenNodeSections = createAsyncThunk('projects/tree/node/section/children/move', async ({projectId, nodeId, sourceId, targetId, chldren  }:
    { projectId: number | string; nodeId: number | string; sourceId: number | string; targetId: number | string; chldren: Array<string> }, thunk) => {
    const { dispatch } = thunk;
    const tree = await ProjectService.moveChildrenBetweenNodeSections(projectId, nodeId, sourceId, targetId, chldren);
    dispatch(updateKnowledgeBase({ id: Number(projectId), tree }));
    dispatch(setScrollId(tree?.attributes?.id));
    return tree;
   }
);
const treeSlice = createSlice({
    name: 'project-tree',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(loadKnowledgeTree.pending, () => ({ isLoading: true }));
        builder.addCase(loadKnowledgeTree.fulfilled, (_state, { payload }) => ({ 
            isLoading: false,
            payload,
        }));
        builder.addCase(loadKnowledgeTree.rejected, () => ({ isLoading: false }) );
        builder.addCase(addNodeToTree.pending, () => ({ isLoading: true }));
        builder.addCase(addNodeToTree.fulfilled, (_state, { payload }) => ({ 
            isLoading: false,
            payload,
        }));
        builder.addCase(addNodeToTree.rejected, () => ({ isLoading: false }) );

        builder.addCase(updateTreeNode.pending, () => ({ isLoading: true }));
        builder.addCase(updateTreeNode.fulfilled, (_state, { payload }) => ({ 
            isLoading: false,
            payload,
        }));
        builder.addCase(updateTreeNode.rejected, () => ({ isLoading: false }) );

        builder.addCase(addNodeSection.rejected, () => ({ isLoading: false }) );
        builder.addCase(addNodeSection.pending, () => ({ isLoading: true }));
        builder.addCase(addNodeSection.fulfilled, (_state, { payload }) => ({ 
            isLoading: false,
            payload,
        }));

        builder.addCase(addChildrenToNodeSection.rejected, () => ({ isLoading: false }) );
        builder.addCase(addChildrenToNodeSection.pending, () => ({ isLoading: true }));
        builder.addCase(addChildrenToNodeSection.fulfilled, (_state, { payload }) => ({ 
            isLoading: false,
            payload,
        }));

        builder.addCase(removeChildrenFromNodeSection.rejected, () => ({ isLoading: false }) );
        builder.addCase(removeChildrenFromNodeSection.pending, () => ({ isLoading: true }));
        builder.addCase(removeChildrenFromNodeSection.fulfilled, (_state, { payload }) => ({ 
            isLoading: false,
            payload,
        }));

        builder.addCase(moveChildrenBetweenNodeSections.rejected, () => ({ isLoading: false }) );
        builder.addCase(moveChildrenBetweenNodeSections.pending, () => ({ isLoading: true }));
        builder.addCase(moveChildrenBetweenNodeSections.fulfilled, (_state, { payload }) => ({ 
            isLoading: false,
            payload,
        }));
    },
});

export default treeSlice.reducer;
