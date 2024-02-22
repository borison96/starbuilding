import { createSlice, PayloadAction } from "@reduxjs/toolkit";
type ResizerProp = {
    height?: number;
    width?: number;
    x?: number;
    y?: number;
}
type ResizerState = {
    left_col: ResizerProp & {
        top_row?: ResizerProp;
    },
    right_col: {
        top_row: ResizerProp;
    }
    target: string;
}
const initialState: ResizerState = {
    left_col: {
        top_row: {},
    },
    right_col: {
        top_row: {}
    },
    target: ''
};

const resizerSlice = createSlice({
    name: 'resizer',
    initialState,
    reducers: {
        updateResizerCol: (state, action: PayloadAction<ResizerProp>) => {
            state.left_col.height = action.payload.height;
            state.left_col.width = action.payload.width;
            state.left_col.x = action.payload.x;
            state.left_col.y = action.payload.y;
        },
        updateResizerLeftRow: (state, action: PayloadAction<ResizerProp>) => {
            state.left_col.top_row = action.payload;
        },
        updateResizerRightRow: (state, action: PayloadAction<ResizerProp>) => {
            state.right_col.top_row = action.payload;
        },
        clearResizerTarget: (state) => {
            state.target = '';
        },
        setResizerTarget: (state, action: PayloadAction<string>) => {
            state.target = action.payload;
        },
    }
});

export const {
    updateResizerCol,
    updateResizerLeftRow,
    updateResizerRightRow,
    setResizerTarget,
    clearResizerTarget,
} = resizerSlice.actions;

export default resizerSlice.reducer;
