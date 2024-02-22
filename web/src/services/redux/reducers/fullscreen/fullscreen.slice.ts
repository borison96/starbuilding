import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export type FullScreenState = {
    target: 'data-table' | 'knowledge-tree' | 'map' | 'kanban' | null;
    bounds?: string | null;
}
const initialState: FullScreenState = {
    target: null,
    bounds: null,
};
const fullScreenSlice = createSlice({
    name: 'fullScreen',
    initialState,
    reducers: {
        setFullScreen: (_state, action: PayloadAction<FullScreenState>) => {
            return action.payload;
        },
        clearFullScreen: () => {
            return initialState;
        }
    }
});

export const { setFullScreen, clearFullScreen } = fullScreenSlice.actions;

export default fullScreenSlice.reducer;
