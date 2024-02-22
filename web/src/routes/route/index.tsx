import { lazy } from "react";
import { paths } from "..";
import Layout from "../../pages/layout";
import { RouteType } from "../../typings";
import privateGuard from "../guards/private.guard";
import publicGuard from "../guards/public.guard";

const routes: Array<RouteType> = [
    {
        path: paths.AUTH,
        component: lazy(() => import('../../pages/auth-registration/Auth.page')),
        guards: [publicGuard],
        children: [
            { path: ':screen', component: lazy(() => import('../../pages/auth-registration/screens/Auth.componet'))},
        ]
    },
    {
        path: paths.DASHBOARD,
        component: lazy(() => import('../../pages/dashboard/dashboard')),
        guards: [privateGuard],
        layout: Layout,
        layoutProps: { navbar: true }
    },
    { path: paths.PROFIL, component: lazy(() => import('../../pages/profil/profil')), guards: [privateGuard], layout: Layout, layoutProps: { navbar: true } },
];

export default routes;
