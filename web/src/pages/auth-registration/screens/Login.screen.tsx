import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Organisation } from "../../../domain/domain";
import { useDispatch, useSelector } from "../../../hooks";
import { paths } from "../../../routes";
import { createOrganisationAction } from "../../../services/redux/reducers/org";
import { loginUserAction } from "../../../services/redux/reducers/user";
import Input from "../../../ui-components/input/input";
import ShowHide from "../../../ui-components/input/ShowHide.component";
import SelectOrgScreen from "./SelectOrg.screen";
import CreateOrgStep from "./steps/CreateOrg.step";
import WaitingStep from "./steps/Waiting.step";

const LoginScreen = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [pwdError, setPwdError] = useState(false);
    const [selectedOrg, setSelectedOrg] = useState<Organisation>();
    const [emailErrorMsg, setEmailErrorMsg] = useState<string>(t('invalid-email'));
    const [pwdErrorMsg, setPwdErrorMsg] = useState<string>(t('invalid-password'));
    const [loginError, setLoginError] = useState('');
    const [orgData, setOrgData] = useState<Organisation>();
    const [orgDataErros, setOrgDataErrors] = useState<any>({});

    const dispatch = useDispatch();
    const [params, setParams] = useSearchParams();
    const navigate = useNavigate();
    const step = params.get('step');
    const user = useSelector((state) => state.user);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (user) {
            setParams({ step: 'select_org' });
        }
    }, [user]);

    const handleOrgDataChange = (data: any) => {
        // validate
        setOrgData((prev: any) => ({ ...prev, ...data }));
    };
    const handleCreateOrganisation = () => {
        if (!orgData?.corporateName?.trim()) {
            setOrgDataErrors((prev: any) => ({ ...prev, corporateName: t('corporate-name-error')}))
        } else {
            dispatch(createOrganisationAction({ ...orgData, name: orgData.corporateName })).unwrap().then(
                (res: any) => {
                    if (res) {
                        //setParams({ step: 'invite_org_members' });
                        navigate(paths.DASHBOARD);
                    }
                }
            );
        }
    }

    const checkForm = () => {
        let email_regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
        let pwd_regex = new RegExp('(?=.{8,})(?=.*[^A-Za-z0-9])')
        if (!email_regex.test(email) || !pwd_regex.test(password)) {
            if (!email_regex.test(email)) {
                setEmailError(true);
            }
            if (!pwd_regex.test(password)) {
                setPwdError(true);
            }
            return false;
        }
        return true;
    }

    const onSubmit = () => {
        if (checkForm()) {
            dispatch(loginUserAction([{ username:email, password },, () => setLoginError(t('invalid-login'))]))
            .unwrap()
            .catch((err: any) => {
                setLoginError(t('invalid-login'))
            });
            // dispatch(logIn({ username:email, password }));
        }
    };
    const onSubmitOrg = () => {
        navigate(paths.DASHBOARD);
    }
    switch(step) {
        case 'create_org':
            return (
                <div className="auth-content-cc">
                    <CreateOrgStep onChange={handleOrgDataChange} data={orgData} errors={orgDataErros} />
                    <Input type="submit" title={t('create-my-organisation')} onClick={handleCreateOrganisation} iconName={faAngleRight}/>
                </div>
            );
        case 'select_org':
            return (
                <div className="auth-content-cc-cc">
                    <SelectOrgScreen selectedOrg={selectedOrg} setSelectedOrg={setSelectedOrg} onSubmitOrg={onSubmitOrg} />
                </div>
            );
        case '5':
            return (
                <div className="auth-content-cc">
                    <WaitingStep onNext={onSubmitOrg} data={{ email: user?.email, selectedOrg: selectedOrg }} />
                </div>
            );
        default:
            return (
                <div className="auth-content-cc">
                    <Input type="text" title={t('email')} onChange={(e: any) => setEmail(e?.target?.value)} hasError={emailError} errorMsg={emailErrorMsg} />
                    <Input
                        type={showPassword ? 'text' : 'password'}
                        title={t('password')}
                        doThings={setPassword}
                        hasError={pwdError}
                        errorMsg={pwdErrorMsg}
                        icon={
                            <ShowHide onClick={() => setShowPassword(prev => !prev)} show={showPassword} />
                        }
                    />
                    { loginError && <span className={"errorMsg"}>{loginError}</span> }
                    <Input type={"submit"} title={t('continue')} doThings={onSubmit} iconName={faAngleRight}/>
                </div>
            )
    };
};
export default LoginScreen;
