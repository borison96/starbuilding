import { combineReducers } from 'redux';
import store from './store';

import {authSlice, createUserSlice, panelSlice} from './reducers/auth/auth.slice';
import { getCurrentUserSlice } from './reducers/user/user-reducer';

const rootReducer = combineReducers({
    currentUser: getCurrentUserSlice.reducer,
    createUser: createUserSlice.reducer,
    user: authSlice.reducer,
    panel: panelSlice.reducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default rootReducer;


//NOT USE ANYMORE ??