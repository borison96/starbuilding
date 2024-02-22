import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Input from "../../../../ui-components/input/input";
import ShowHide from "../../../../ui-components/input/ShowHide.component";
import { StepsPropsType } from "./types";

const CredentialsStep = ({ onNext, data, errors }: StepsPropsType) => {
    const { t } = useTranslation();
    const [firstName, setfirstName] = useState("");
    const [lastName, setlastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [checkPassword, setCheckPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    useEffect(() => {
        setfirstName(data?.firstName ?? '');
        setlastName(data?.lastName ?? '');
        setEmail(data?.email ?? '');
        setPassword(data?.password ?? '');
        setCheckPassword(data?.checkPassword ?? '');
    }, []);

    const handleNext = (e: any) => {
        e?.preventDefault();
       if(onNext) onNext({ firstName, lastName, email, password, checkPassword });
    };

    return (
        <form id="register" className="sign_form-container">
            <div style={{ color: '#E33F1A', fontSize: 12 }}>{t('required-info')}</div>
            <Input
                containerClassName="input-compact"
                required
                type={"text"}
                name="firstName"
                title={t('first-name')}
                onChange={(e: any) => setfirstName(e.target.value)}
                hasError={typeof errors?.firstName === 'string' && errors.firstName !== ''}
                errorMsg={errors?.firstName}
                value={firstName}
            />
            <Input
                required
                type={"text"}
                name="lastName"
                title={t('last-name')}
                onChange={(e: any) => setlastName(e.target.value)}
                hasError={typeof errors?.lastName === 'string' && errors.lastName !== ''}
                errorMsg={errors?.lastName}
                value={lastName}
            />
            <Input
                required
                type="email"
                name="email"
                title={t('email')}
                onChange={(e: any) => setEmail(e.target.value)}
                hasError={typeof errors?.email === 'string' && errors.email !== ''}
                errorMsg={errors?.email}
                value={email}
            />
            <Input
                required
                type={showPassword ? 'text' : 'password'}
                name="password"
                title={t('password')}
                onChange={(e: any) => setPassword(e.target.value)}
                hasError={typeof errors?.password === 'string' && errors.password !== ''}
                errorMsg={errors?.password}
                value={password}
                icon={
                    <ShowHide onClick={() => setShowPassword(prev => !prev)} show={showPassword} />
                }
            />
            <Input
                required
                type={showConfirmPass ? 'text' : 'password'}
                name="checkPassword"
                title={t('confirmation')}
                onChange={(e: any) => setCheckPassword(e.target.value)}
                hasError={password !== checkPassword || (typeof errors?.checkPassword === 'string' && errors.checkPassword !== '')}
                errorMsg={password !== checkPassword ? t('password-check-failed') : errors?.checkPassword}
                value={checkPassword}
                icon={
                    <ShowHide onClick={() => setShowConfirmPass(prev => !prev)} show={showConfirmPass} />
                }
            />
            <Input type={"submit"} title={t('continue')} onSubmit={(e: any) => e?.preventDefault() } onClick={handleNext} iconName={faAngleRight}/>
            <div className={"check-cgu"}>
                <div className={"check-cgu-line"}>
                    <label>
                        <input name='condition_utilisation' type={"radio"} className={"form-check-input"}/>
                            {' '}
                            {t('by-clicking-you-accept')}
                            {' '}
                            <a href='#' style={{ color: 'inherit'}}>{t('usage-conditions')}</a>
                            {' '}
                            {t('of')}
                            {' '}
                            {t('app-name')}
                    </label>
                </div>
                <div className={"check-cgu-line"}>
                <label>
                        <input name='condition_utilisation' type={"radio"} className={"form-check-input"}/>
                            {' '}
                            {t('by-clicking-you-accept')}
                            {' '}
                            <a href='#' style={{ color: 'inherit'}}>{t('privacy-policy')}</a>
                            {' '}
                            {t('of')}
                            {' '}
                            {t('app-name')}
                    </label>
                </div>
            </div>
        </form>
    )
};

export default CredentialsStep;
