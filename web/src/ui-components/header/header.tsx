import React, { useMemo } from 'react';
import "./header.scss"
import home from './../../asset/svg/home.svg'
import building from './../../asset/svg/building.svg'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faBars} from "@fortawesome/free-solid-svg-icons";
import dashboard from "../../asset/svg/dashboard.svg";
import CustomButton from "../button/custom-button";
import {
    resetAuth,
    TabChange
} from "../../services/redux/reducers/auth/auth.slice";
import { logoutLocal } from '../../storage/local.storage';
import { clearUser } from '../../services/redux/reducers/user';
import { useDispatch, useSelector } from '../../hooks';
import { useTranslation } from 'react-i18next';
import { selectProject, setActiveNode } from '../../services/redux/reducers/tree-node/treeNode.slice';



const Header = () => {
    const dispatch = useDispatch();
    const pages = useSelector(state => state.pages);
    const { response } = useSelector(state => state.currentUser);
    const organisation = useSelector(state => state.organisation);
    const { t } = useTranslation();
    const page = pages.pages;
    const project_selected = pages.project_view;

    const displayInvitationPanel = () => {
        dispatch(TabChange("Invitation"));
    }

    const displayDashboard = () => {
        if (project_selected.is_active) {
            dispatch(setActiveNode(null));
            dispatch(selectProject(null));
        }
        dispatch(TabChange("Dashboard"));
    }
    
    const returnHeaderbyPage = () => {
        if (page === "/") {
            if (project_selected.is_active) {
                return (
                    <>
                        <CustomButton title={t('project-dashboard')} icon={dashboard} doThings={displayDashboard} dark={project_selected.is_active} />
                        <CustomButton title={"Inviter"} icon={dashboard} doThings={displayInvitationPanel} dark={project_selected.is_active}/>
                        <CustomButton title={"Bâtir"} icon={dashboard} dark={project_selected.is_active}/>
                    </>
                )
            }
            return (
                <>
                    <CustomButton title={t('user-dashboard')} icon={dashboard} doThings={displayDashboard} />
                    <CustomButton title={"Actualité"} icon={dashboard} />
                </>
            );
        } else if (page === "/profil") {
            return (
                <>
                    <CustomButton title={"Profil"} icon={dashboard}/>
                    <CustomButton title={"Mot de passe"} icon={dashboard}/>
                </>
            )
        }
    }

    const returnHeader = () => {
        if (project_selected.is_active && page === "/") {
            return (
                <>
                    <h6>{t('active-project')}</h6>
                    <h4>{project_selected.name}</h4>
                </>
            )
        } else {
            return (
                <>
                    <h6>{t('welcome')} {response.content?.firstName}</h6>
                    <h4>{t('your-dashboard')}</h4>
                </>
            );
        }
    }

    return (
        <div className={project_selected.is_active && page === "/"?"header-main header-project-color":"header-main header-color"}>
            <img className={"logo"} alt={""} src={project_selected.is_active && page === "/"?building:home}/>
            <div>
                {returnHeader()}
                <div className={"header-btn"}>
                    {returnHeaderbyPage()}
                </div>
            </div>
            <div className={"header-right"}>
                <div style={{ marginRight: 15 }}>
                    {
                        (organisation?.name || organisation?.corporateName) && (
                            <p style={{ margin: 0 }}>
                                {t('you-are-on')}
                                {' '}
                                <span
                                    title={ organisation?.name || organisation?.corporateName }
                                    style={{
                                        display: 'inline-block',
                                        maxWidth: 180,
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        verticalAlign: 'text-top',
                                        color: '#ccf',
                                    }}
                                >
                                    { organisation?.name || organisation?.corporateName }
                                </span>
                            </p>
                        )
                    }
                    {
                        (organisation?.address || organisation?.postalCode) && (
                            <span style={{ fontSize: 10, color: '#888' }}>
                                { organisation?.address || organisation?.postalCode }
                            </span>
                        )
                    }
                </div>
                <div className={"disconnect-container"}>
                    <FontAwesomeIcon icon={faBars} onClick={() => {
                        dispatch(resetAuth());
                        dispatch(clearUser());
                        logoutLocal();
                        setTimeout(() => window?.location?.reload(), 300);
                    }}/>
                </div>
            </div>
            {/*<img src={fake} className={"fakeheader"}/>*/}
        </div>
    );
};

export default Header