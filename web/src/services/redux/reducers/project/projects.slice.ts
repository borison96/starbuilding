import { ProjectDetails, ProjectKnowledgeBase } from "../../../../typings/api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import ProjectService from "../../../../api/service/project-service/project-service";
import { loadKnowledgeTree } from "./knowledge-tree.slice";
import { setScrollId } from "../kanban/kanban.slice";
import { sortDataTableProjects } from "../../../../utils";
import { ActiveNodesType, TreeNodeType } from "../../../../typings";

export type ProjectPayload = Array<ProjectDetails>;
export type ProjectsState = {
    isLoading: boolean;
    payload?: ProjectPayload;
};

const initialState: ProjectsState = {
    isLoading: false,
};

export const getProjects = createAsyncThunk('projects/get', async (p, thunk) => {
    const projects = await ProjectService.getProjects();

    return projects?.projects?.sort(sortDataTableProjects).map((p: any) => {
        let modif = { ...p };
        if (projects?.knowledgeBaseMap[p.id]) {
            modif = { ...modif, tree: projects?.knowledgeBaseMap[p.id]?.tree };
        }
        if (projects?.creatorMap[p.id]) {
            modif = { ...modif, creator: projects?.creatorMap[p.id] };
        }
        return modif;
    });
});
export const updateProject = createAsyncThunk('projects/update-one', async ({id, node }: { id: string | number; node: ProjectDetails }, thunk) => {
    const project = await ProjectService.updateProject(id, node);
    const { getState, dispatch } = thunk;
    dispatch(setScrollId(project?.knowledgeBase?.tree?.attributes?.id));
    const state: any = getState();
    return state.projects?.payload?.map(
        (proj: any) => {
            if (proj?.id === id) {
                return { ...proj, ...(project?.project ?? {}), tree: project?.knowledgeBase?.tree };
            }
            return proj;
        }
    );
});

const projectsSlice = createSlice({
    name: 'projects',
    initialState,
    reducers: {
        addProject: (state, action: PayloadAction<ProjectDetails>) => {
            return { isLoading: false, payload: [ action.payload, ...( state.payload ?? [])] };
        },
        updateKnowledgeBase: (state, action: PayloadAction<{id: number; tree: ProjectKnowledgeBase}>) => {
            return { ...state, payload: state.payload?.map((p) => {
                if (p.id === action.payload.id) return { ...p, tree: (action.payload.tree as any) };
                return p;
            }) };
        },
        bulkUpdateKnowledgeBase: (state, action: PayloadAction<{[key: string | number]: ProjectKnowledgeBase }>) => {
            return { ...state, payload: state.payload?.map((p) => {
                if (action.payload[p.id]) return { ...p, tree: action.payload[p.id] as any };
                return p;
            }) };
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getProjects.pending, () => ({ isLoading: true }));
        builder.addCase(getProjects.fulfilled, (state, { payload }) => ({ 
            isLoading: false,
            payload,
        }));
        builder.addCase(getProjects.rejected, () => ({ isLoading: false }) );
        builder.addCase(updateProject.fulfilled, (state, { payload }) => {
            state.payload = payload;
        });
    },
});

export const {
    addProject,
    updateKnowledgeBase,
    bulkUpdateKnowledgeBase,
} = projectsSlice.actions;

export default projectsSlice.reducer;
