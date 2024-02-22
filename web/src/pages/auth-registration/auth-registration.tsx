import React, {useEffect, useRef, useState} from "react";
import string from './../../asset/strings.json';
import './login.scss';
import logo from './../../asset/svg/logo.svg'
import SignForm from "./sign-form";
import {faAngleLeft, faAngleRight} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../services/redux/root-reducers";
import {createUser, createUserState, PhoneInputPanel} from "../../services/redux/reducers/auth/auth.slice";
import SocialLogin from "./social-login";
import {AuthEnum} from "./auth-enum";
import Input from "../../ui-components/input/input";


const AuthRegistration = () => {
    const [register, setRegister] = useState(AuthEnum.login)
    const createUserRef = useRef() as React.MutableRefObject<HTMLInputElement>;
    const [form, setRegisterForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        checkPassword: '',
        phone: 0,
        userType: 'pro'
    });
    const registerResponse = useSelector<RootState, createUserState>((state) => state.createUser);
    const dispatch = useDispatch();
    const onSubmit = () => {
        let phone_regex = new RegExp("(?:(?:\\+|00)33|0)\\s*[1-9](?:[\\s.-]*\\d{2}){4}")
        if (phone_regex.test(form.phone.toString())) {
            dispatch(PhoneInputPanel(false))
            dispatch(createUser(form));
        } else {
            dispatch(PhoneInputPanel(true))
        }
    };

    useEffect(() => {
        if (registerResponse.isLoading && registerResponse.payload.errors.length <= 0) {
            setRegister(AuthEnum.register_pro)
        }
    }, [registerResponse])

    const returnPageDescription = (register: AuthEnum) => {
        if (register === AuthEnum.login) {
            return (
                <>
                    <b>Se connecter</b>
                    <h5>{string.login_description}</h5>
                    <SocialLogin />
                </>
            )
        } else if (register === AuthEnum.register || register === AuthEnum.register_step2) {
            return (
                <>
                    <b>S'inscrire</b>
                    <h5>{string.register_description}</h5>
                    <SocialLogin/>
                </>
            )
        } else if (register === AuthEnum.register_pro) {
            return (
                <>
                    <b>Compléter votre profil professionnel</b>
                    <h5>{string.register_description}</h5>
                </>
            )
        }  else if (register === AuthEnum.join_org || register === AuthEnum.choose_org) {
            return (
                <>
                    <b>Rejoindre votre organisation</b>
                    <h5>{string.join_organisation}</h5>
                </>
            )
        }
    }
    const returnPageFooter = (register: AuthEnum) => {
        if (register === AuthEnum.register_step2) {
            return (
                <>
                    <p className={"sign_user-type-center"}>{string.choose_profil_user}</p>
                    <div className={"sign_user-type"}>
                        <Input
                            type="submit"
                            containerClassName="disabled"
                            iconName={faAngleRight}
                            title="Je suis un particulier"
                            onClick={() => setRegister(AuthEnum.register_particulier)}
                            disabled
                        />
                        <Input type="submit" iconName={faAngleRight} onClick={onSubmit} title="Je suis un professionnel" />
                    </div>
                </>
            )
        } else if (register === AuthEnum.register_pro) {
            return (
                <>
                    <p className={"sign_user-type-center"}>{string.choose_organisation}</p>
                    <div className={"sign_user-type"}>
                        <Input type="submit" iconName={faAngleRight} onClick={() => setRegister(AuthEnum.join_org)} title="Rejoindre une organisation" />
                        <Input type="submit" iconName={faAngleRight} title="Créer une organisation" />
                    </div>
                </>
            )
        }
    }

    function goBack() {
        if (register > AuthEnum.register) {
            setRegister(register - 1);
        }
    }

    return (
        <div className={register >= AuthEnum.register_step2 ?"login_fullbackground register_grid-row":"login_fullbackground"}>
            <div className={"login_grid-column"}>
                <div className={"login_left-container"}>
                    <div>
                        <img src={logo} className={"login_logo"}/>
                    </div>
                    { returnPageDescription(register)}

                </div>
                <div className={"login_right-container"}>
                    <div className={"login_switch"}>
                        <button type="button" className={register?'':'selected'} onClick={() => setRegister(AuthEnum.login)}>Connexion</button>
                        <button type="button" className={register?'selected':''} onClick={() => setRegister(AuthEnum.register)}>Inscription</button>
                    </div>
                    <SignForm registered={register} setRegister={setRegister} setRegisterForm={setRegisterForm}/>
                </div>
                <div className={"login_goback"}>
                    {register > AuthEnum.login && (
                        <>
                            <div className={"register_goback"} onClick={() => goBack()}>
                                <FontAwesomeIcon icon={faAngleLeft} className={"icon_center"} />
                            </div>
                        </>
                        )}
                </div>
            </div>
            { register >= AuthEnum.register_step2 && <div className={"login_footer"}> {returnPageFooter(register)}</div>}
        </div>
    )
}

export default AuthRegistration
