import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { t } from "i18next";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "../../../hooks";
import { paths } from "../../../routes";
import { createUser } from "../../../services/redux/reducers/auth/auth.slice";
import Input from "../../../ui-components/input/input";
import { validator } from "../../../utils";
import CompetenceStep from "./steps/Competence.step";
import ContactStep from "./steps/Contact.step";
import CredentialsStep from "./steps/Credentials.step";
import JoinOrgStep from "./steps/JoinOrg.step";
import WaitingStep from "./steps/Waiting.step";

const RegisterScreen = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [registerData, setRegisterData] = useState<any>({});
    const [registerDataErrors, setRegisterDataErrors] = useState<any>({});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const step = searchParams.get('step');
    const stepGen = useMemo(() => (function* () {
        const _step = Number(step);
        let index = _step > 0 ? _step : 1;
        while (true) {
            if (index > 5) {
                index = 1;
            }
            yield (++index).toString();
        }
    })(), [step]);
    const handleRegisterDataChange = (data: any) => {
        // validate
        setRegisterData((prev: any) => ({ ...prev, ...data }));
    };
    const validateData = (data: any): boolean => {
        let valid = true;
        if (!data?.password) {
            setRegisterDataErrors((prev: any) => ({ ...prev, password: `${t('password')} ${t('is-obligatory')}`}));
            valid = false;
        }
        if (!data?.email) {
            setRegisterDataErrors((prev: any) => ({ ...prev, email: `${t('email')} ${t('is-obligatory')}`}));
            valid = false;
        }
        if (!data?.checkPassword) {
            setRegisterDataErrors((prev: any) => ({ ...prev, checkPassord: `${t('confirmation')} ${t('is-obligatory')}`}));
            valid = false;
        }
        if (!data?.firstName) {
            setRegisterDataErrors((prev: any) => ({ ...prev, firstName: `${t('first-name')} ${t('is-obligatory')}`}));
            valid = false;
        }
        if (!data?.lastName) {
            setRegisterDataErrors((prev: any) => ({ ...prev, lastName: `${t('last-name')} ${t('is-obligatory')}`}));
            valid = false;
        }
        if (data?.email && !validator.isEmail(data?.email)) {
            setRegisterDataErrors((prev: any) => ({ ...prev, email: t('invalid-email')}));
            valid = false;
        }
        if (data.password && !validator.isValidPassword(data?.password)) {
            setRegisterDataErrors((prev: any) => ({ ...prev, password: t('invalid-password')}));
            valid = false;
        }
        return valid;
    }
    const handleCreateUser = () => {
        // validate phone
        if (!validateData(registerData)) {
            setSearchParams({ step: '1' });
        } else if (!registerData.phone) {
            setRegisterDataErrors((prev: any) => ({ ...prev, phone: `${t('phone')} ${t('is-obligatory')}`}));
        } else {
            dispatch(createUser(registerData)).unwrap().then((response: any) => {
                if (response?.errors && response?.errors.length > 0) {
                    response.errors.forEach((err: any) => {
                        if (err.field) setRegisterDataErrors((prev: any) => ({ ...prev, [err.field]: `${t(err.field)} ${t('is-obligatory')}`}));
                        if (err.message) {
                            if (err.message === 'email_is_already_taken') {
                                setRegisterDataErrors((prev: any) => ({ ...prev, email: t('email_is_already_taken')}));
                            }
                            if (err.message === 'phone_is_already_taken') {
                                setRegisterDataErrors((prev: any) => ({ ...prev, email: t('phone_is_already_taken')}));
                            }
                        }
                    });
                    setSearchParams({ step: '1' });
                } else {
                    setSearchParams({ step: stepGen.next().value });
                }
            }).catch((error: any) => {
                console.log({ error });
            });
        }
    }
    const handleNextStep = (data: any) => {
        handleRegisterDataChange(data);
        // validate
        if (validateData(data)) {
            setRegisterDataErrors({});
            setSearchParams({ step: stepGen.next().value });
        }
    };
    const handleComplete = () => {
        if (validateData(registerData)) {
            navigate(paths.DASHBOARD);
            toast.success(t('register-sucess', { appName: 'StartBuilding' }), { duration: 8000 });
        } else {
            setSearchParams({ step: '1' });
        }
    }
    const handleNext = (data: any) => {
        handleRegisterDataChange(data);
        if (validateData(registerData)) {
         setSearchParams({ step: stepGen.next().value });
        }
    }
    switch(step) {
        case '5':
            return (
                <div className="auth-content-cc">
                    <WaitingStep onNext={handleNext} data={registerData} errors={registerDataErrors} />
                </div>
            );
        case '4':
            return (
                <div className="auth-content-cc">
                    <JoinOrgStep onComplete={handleComplete} onNext={handleNext} data={registerData} errors={registerDataErrors} />
                </div>
            );
        case '3':
            return (
                <>
                    <div className="auth-content-cc">
                        <CompetenceStep onNext={handleNextStep} data={registerData} errors={registerDataErrors} />
                    </div>
                    <div className="auth-content-cc-cc">
                        <h5 className="auth-select-user-type__heading">{t('choose_organisation')}</h5>
                        <div className="auth-select-user-type">
                            <Input
                                type="submit"
                                iconName={faAngleRight}
                                title={t('join_organisation')}
                                onClick={() => setSearchParams({ step: stepGen.next().value })}
                            />
                            <Input 
                                containerClassName="disabled"
                                type="submit"
                                iconName={faAngleRight}
                                title={t('create_organisation')}
                                disabled
                            />
                        </div>
                    </div>
                </>
            );
        case '2':
            return (
                <>
                    <div className="auth-content-cc">
                        <ContactStep onChange={handleRegisterDataChange} data={registerData} errors={registerDataErrors} />
                    </div>
                    <div className="auth-content-cc-cc">
                        <h5 className="auth-select-user-type__heading">{t('select-user-type')}</h5>
                        <div className="auth-select-user-type">
                            <Input
                                type="submit"
                                containerClassName="disabled"
                                iconName={faAngleRight}
                                title={t('iam-individual')}
                                disabled
                            />
                            <Input type="submit" iconName={faAngleRight} title={t('iam-professional')} onClick={handleCreateUser}/>
                        </div>
                    </div>
                </>
            )
        case '1':
        default:
            return (
                <div className="auth-content-cc">
                    <CredentialsStep onNext={handleNextStep} data={registerData} errors={registerDataErrors} />
                </div>
            );
    }
};

export default RegisterScreen;
