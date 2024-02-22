import { Outlet, useNavigate, useParams, useSearchParams } from "react-router-dom";
import './login.scss';
import logo from './../../asset/svg/logo.svg'
import SocialLogin from "./social-login";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { paths } from "../../routes";
import { useEffect, useMemo } from "react";
import { useSelector } from "../../hooks";
const AuthPage = () => {
    const { t } = useTranslation();
    const user = useSelector(state => state.user);
    const [searchParams] = useSearchParams();
    const params = useParams();
    const navigate = useNavigate();
    const { screen } = params;
    const step = searchParams.get('step');
    const goBack = () => {
         navigate(-1);
    }
    const handleSetScreen = (s: string) => {
        navigate(`${paths.AUTH}/${s}`);
    }
    useEffect(() => {
        if (!screen) handleSetScreen('login');
    }, []);
    const Title = useMemo(() => {
        switch(step) {
            case '5':
                return {
                    title: <h1>{t('waiting-approval')}</h1>,
                    subtitle: (
                        <>
                            <h5>{t('waiting-approval-gist-1', { appName: 'StartBuilding' })}</h5>
                            <h5>{t('waiting-approval-gist-2')}</h5>
                            <h5>{t('waiting-approval-gist-3')}</h5>
                        </>
                    ),
                };
            case '4':
                return {
                    title: <h1>{t('jon-your-organisation')}</h1>,
                    subtitle: <h5>{t('on_join_organisation')}</h5>,
                };
            case 'reg_pro':
                return {
                    title: <h1>{t('complete-pro-profile')}</h1>,
                    subtitle: <h5>{t('register_description')}</h5>,
                };
            case 'select_org':
                return {
                    title: <h1>{t('you-are-connected')}</h1>,
                    subtitle: <h5>{t('find-your-organisation')}</h5>,
                };
            case 'create_org':
                return {
                    title: <h1>{t('create-your-organisation')}</h1>,
                    subtitle: <h5>{t('create-org-step-gist')}</h5>,
                };
            default:
                if (screen === 'login') {
                    return {
                        title: <h1>{t('to-login')}</h1>,
                        subtitle: <h5>{t('login_description')}</h5>,
                    };
                }
                return {
                    title: <h1>{t('to-register')}</h1>,
                    subtitle: <h5>{t('register_description')}</h5>,
                };
        }
    }, [step, screen]);
    return (
        <div className="login_fullbackground">
            <div className="auth-container-cc">
                <div className="auth-content-wrapper">
                    <div style={{ minWidth: 200 }}>
                        <img src={logo} className="app-auth-logo"/>
                    </div>
                    <div className="aut-switch-wrapper">
                        {
                            user ? null : (
                                <div className="login_switch">
                                    <button type="button" className={screen !== 'register' ? 'selected' : ''} onClick={() => handleSetScreen('login')}>{t('login')}</button>
                                    <button type="button" className={screen === 'register' ? 'selected' : '' } onClick={() => handleSetScreen('register')}>{t('register')}</button>
                                </div>
                            )
                        }
                        <div className="register_goback" onClick={goBack}>
                            <FontAwesomeIcon icon={faAngleLeft} className={"icon_center"} />
                        </div>
                    </div>
                </div>
                <div className="auth-content-wrapper">
                    <div className="auth-content-cc">
                        { Title.title }
                    </div>
                </div>
                <div className="auth-content-wrapper">
                    <div className="auth-content-cc">
                        <div className="auth-subtitle-cc">{ Title.subtitle }</div>
                        { step === null || step === '1' ? <SocialLogin /> : null }
                    </div>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}
export default AuthPage;
