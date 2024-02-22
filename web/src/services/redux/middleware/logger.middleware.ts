import { Middleware } from "@reduxjs/toolkit";

const logger: Middleware = (store) => (next) => (action) => {
    const returnValue = next(action);
    if (['DEV', 'REC'].includes(process.env.REACT_APP_ENV ?? '')) {
        // console.group(action.type);
        // console.log('ACTION: ', action);
        // console.log('STATE: ', store.getState());
        // console.groupEnd();
    }
    return returnValue;
};

export default logger;
