import React, { Suspense } from "react";
import { Spinner } from "react-bootstrap";
import {Routes, Route} from "react-router-dom";
import routes from ".";
import { RouteType } from "../../typings";
import Guard from "../guards/Guard.component";

const Router = () => {
    const unwrap = (_routes: Array<RouteType>): any => {
        return _routes.map((route: RouteType) => {
            if (route.children) { return (
                <Route key={route.path} path={route.path} element={<Guard route={route} />}>
                    { unwrap(route.children) }
                </Route>
            )}
           return <Route key={route.path} path={route.path} element={<Guard route={route} />} />
        })
    }
    return (
        <Suspense fallback={
            <div style={{ height: '50vh', width: '50vw', margin: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <Spinner animation="grow" variant="info" />
            </div>
            }
        >
            <Routes>
                {
                    unwrap(routes)
                }
            </Routes>
        </Suspense>
    );
};

export default Router;