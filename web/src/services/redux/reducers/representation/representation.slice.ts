import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const Representations = {
    map: true,
    gantt: true,
    kanban: true,
    graph: false,
    files: true,
    model_3d: true,
    model_3d_digital: false,
    flux: false,
    text: false,
};

export interface RepresentationState {
    component: string;
    active: number | string;
}

const initialState: RepresentationState = {
    component: 'map',
    active: '',
};

const representationSlice = createSlice({
    name: 'representation',
    initialState,
    reducers: {
        enableRepresentation: (state, action: PayloadAction<keyof typeof Representations>) => {
            state.component = action.payload;
        },
        setActiveRepresentationNode: (state, action: PayloadAction<number | string>) => {
            state.active = action.payload;
        },
    }
});

export const { enableRepresentation, setActiveRepresentationNode } = representationSlice.actions;

export default representationSlice.reducer;
