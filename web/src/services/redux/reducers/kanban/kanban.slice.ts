import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type KanbanViewType = 'single' | 'list';
export interface MapStateType {
    column: string;
    scrollId: string;
    viewType: KanbanViewType;
};

const initialState: MapStateType = {
    column: 'todo',
    scrollId: '',
    viewType: 'single',
};

const kanbanSlice = createSlice({
    name: 'kanban-slice',
    initialState,
    reducers: {
        setColunm: (state, action: PayloadAction<string>) => {
            state.column = action.payload;
        },
        resetColumn: (state) => {
            state.column = initialState.column;
        },
        setScrollId: (state, action: PayloadAction<string>) => {
            state.scrollId = action.payload;
        },
        resetScrollId: (state) => {
            state.scrollId = initialState.scrollId;
        },
        setKanbanViewType: (state, action: PayloadAction<KanbanViewType>) => {
            state.viewType = action.payload;
        },
    }
});

export const { setColunm, resetColumn, setScrollId, resetScrollId, setKanbanViewType } = kanbanSlice.actions;

export default kanbanSlice.reducer;
