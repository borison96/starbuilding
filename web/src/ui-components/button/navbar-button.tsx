import React from 'react';
import './custom-button.scss'
import {useSelector} from "react-redux";
import {RootState} from "../../services/redux/store";

type NavbarButtonProps = {
    icon: string
    redirect?: string
    doThings?: Function
    badge?: string | number,
}

const NavBarButton = ({ icon, redirect, doThings, badge }: NavbarButtonProps) => {
    const pages = useSelector<RootState, string>((state) => state.pages.pages);
    return (
        <div tabIndex={0} role="button" className={pages === redirect && redirect?"custom-icon selected":"custom-icon"} onClick={() => {
            doThings && doThings()
        }} >
            <img style={{ width: 25, height: 25 }} src={icon} alt=""/>
            {
                typeof badge != 'undefined' ? (
                    <div className="navbar-badge-cc">{ badge }</div>
                ) : null
            }
        </div>
    );
};

export default NavBarButton;
