import React, {ReactNode, useState} from "react";
import { LayoutProps } from "../typings";
import Header from "../ui-components/header/header";
import NavBar from "./navbar";
import './navbar.scss'
import {useSelector} from "../hooks";

const Layout = ({ children, navbar, title }: LayoutProps) => {
    const [openAvatar, setOpenAvatar] = useState(false);
    const { project_view } = useSelector((state) => state.pages);

    return (
        <div className='main-layout'>
        {navbar && <NavBar />}
            <div>
                <Header />
                <div className={`background-layout ${project_view.is_active?"light":"dark"}`}>{children}</div>
            </div>
        </div>

);
};

    export default Layout;