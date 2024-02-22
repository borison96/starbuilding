import { configureStore } from '@reduxjs/toolkit';
import rootReducers from './root.reducers';
import middlewareArray from './middlewareArray';

const store = configureStore({
    reducer: rootReducers,
    middleware: (middleware) => middleware({ serializableCheck: false }).concat(middlewareArray),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
