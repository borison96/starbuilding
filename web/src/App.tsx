import React, { useEffect } from 'react';
import {BrowserRouter} from "react-router-dom";
import Router from "./routes/route/routeur";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch } from './hooks';
import { loadUserAction } from './services/redux/reducers/user';
import { getLocalOrganisation, getLocalUser } from './storage/local.storage';
import { loadOrgAction } from './services/redux/reducers/org';

function App() {
    const dispatch = useDispatch();
    const user = getLocalUser();
    const org = getLocalOrganisation();
    useEffect(() => {
        if (user) {
            // load user details on each page reload
            dispatch(loadUserAction());
        }
        if (org) {
            dispatch(loadOrgAction())
        }
    }, []);
    return (
        <BrowserRouter>
            <Router/>
        </BrowserRouter>
    );
}
export default App;
