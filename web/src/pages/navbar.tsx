import React, { useState } from 'react';
import logo from './../asset/svg/short-logo.svg'
import house from './../asset/svg/house.svg'
import search from './../asset/svg/search.svg'
import mail from './../asset/svg/mail.svg'
import notification from './../asset/svg/notification.svg'
import user from './../asset/svg/user.svg'
import plug from './../asset/svg/plug.svg'
import param from './../asset/svg/param.svg'
import solidUsers from '../asset/svg/solid-users.svg';
import NavBarButton from "../ui-components/button/navbar-button";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "../hooks";
import {PagesChange, TabChange} from "../services/redux/reducers/auth/auth.slice";
import Overlay from '../ui-components/overlay/Overlay.component';
import { useTranslation } from 'react-i18next';
import { OrgJoinRequest } from '../domain/domain';
import OrgJoinRequestCard from '../ui-components/org/OrgJoinRequestCard';

const NavBar = () => {
    const [showRequests, setShowRequests] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const organisation = useSelector(state => state.organisation);

    function goProfil() {
        dispatch(PagesChange("/profil"))
        dispatch(TabChange("Profil"))
        navigate('/profil')
    }

    function goDashboard() {
        dispatch(PagesChange("/"))
        dispatch(TabChange("Dashboard"))
        navigate('/')
    }
    const toggleRequests = () => {
        setShowRequests((prev) => !prev);
    }

    return (
        <div className={"navbar"}>
            <div className={"navbar-top"}>
                <NavBarButton icon={logo} />
                <NavBarButton icon={house} redirect={'/'} doThings={goDashboard} />
                <NavBarButton icon={search} />
                <NavBarButton icon={mail} />
                <NavBarButton icon={notification} />
                <NavBarButton doThings={toggleRequests} icon={solidUsers} badge={organisation?.joinRequests?.values?.length || undefined} />
                {
                    showRequests && organisation?.joinRequests?.values?.length ? (
                        <Overlay show={showRequests} el=".explorer" container=".background-layout" onDismiss={toggleRequests} className='join-org-overlay'>
                            <h3 style={{ textAlign: 'center' }}>{t('join-requests')}</h3>
                            {
                                organisation?.joinRequests?.values?.map((req: OrgJoinRequest) => (
                                    <OrgJoinRequestCard id={organisation.id} key={req.token} joinRequest={req} />
                                ))
                            }
                        </Overlay>
                    ) : null
                }
            </div>
            <div className={"navbar-bottom"}>
                <NavBarButton icon={user}  redirect={'/profil'} doThings={goProfil} />
                <NavBarButton icon={plug} />
                <NavBarButton icon={param} />
            </div>
        </div>
    );
};

export default NavBar;