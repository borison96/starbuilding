import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MapActivityType {
    create_project?: boolean;
    select_project?: boolean;
}
export interface MapSelection {
    longitude: number;
    latitude: number;
    description?: string;
};
export interface MapStateType {
    activities: MapActivityType;
    selection: MapSelection;
};

const initialState: MapStateType = {
    activities: {
        create_project: true,
        select_project: true,
    },
    selection: {
        latitude: 0,
        longitude: 0,
        description: '',
    }
};

const mapSlice = createSlice({
    name: 'map-slice',
    initialState,
    reducers: {
        enableActivity: (state, action: PayloadAction<keyof MapActivityType>) => {
            state.activities[action.payload] = true;
        },
        disableActivity: (state, action: PayloadAction<keyof MapActivityType>) => {
            state.activities[action.payload] = false;
        },
        toggleActivity: (state, action: PayloadAction<keyof MapActivityType>) => {
            state.activities[action.payload] = !state.activities[action.payload];
        },
        setSelection: (state, action: PayloadAction<MapSelection>) => {
            state.selection = action.payload;
        }
    }
});

export const { enableActivity, disableActivity, toggleActivity, setSelection } = mapSlice.actions;

export default mapSlice.reducer;
