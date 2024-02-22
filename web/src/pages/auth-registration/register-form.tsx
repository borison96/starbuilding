import React, {useCallback, useEffect, useState} from 'react';
import {faAngleRight} from "@fortawesome/free-solid-svg-icons";
import {AsyncTypeahead, Typeahead} from "react-bootstrap-typeahead";
import 'react-bootstrap-typeahead/css/Typeahead.css';
import Input from "../../ui-components/input/input";
import {getConfig} from "../../utils/config";
import {Competence} from "../../domain/domain";
import {AuthEnum} from "./auth-enum";
import {useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../services/redux/store";
import {AuthState, logIn} from "../../services/redux/reducers/auth/auth.slice";
import {PhoneInputState} from "../../services/redux/reducers/auth/auth.slice";

type RegisterFormProps = {
    step: number
    setStep: Function
    setRegisterForm: Function
};

function RegisterForm({step, setStep, setRegisterForm}: RegisterFormProps) {
    const phoneErr = useSelector<RootState, PhoneInputState>((state) => state.panel);
    const [firstName, setfirstName] = useState("");
    const [lastName, setlastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [checkPassword, setCheckPassword] = useState("");
    const [phone, setPhone] = useState(0);
    const [fixPhone, setFixPhone] = useState(0);
    const [linkedinUrl, setLinkedInUrl] = useState("");
    const [skills, setSkills] = useState("");


    const [firstNameError, setfirstNameError] = useState(false);
    const [lastNameError, setlastNameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [pwdError, setPwdError] = useState(false);
    const [pwdCheckError, setPwdCheckError] = useState(false);
    const [phoneError, setPhoneError] = useState(false);
    const [phoneFixedError, setPhoneFixedError] = useState(false);
    const [linkedinError, setLinkedinError] = useState(false);

    const [firstNameErrorMsg, setfirstNameErrorMsg] = useState("Le prénom est obligatoire");
    const [lastNameErrorMsg, setlastNameErrorMsg] = useState("Le nom est obligatoire");
    const [emailErrorMsg, setEmailErrorMsg] = useState("L'email n'est pas valide");
    const [pwdErrorMsg, setPwdErrorMsg] = useState("Votre mot de passe doit contenir au minimum 8 caractères et 1 caractère spécial");
    const [pwdCheckErrorMsg, setPwdCheckErrorMsg] = useState("Les mot de passes ne sont pas similaires");
    const [phoneErrorMsg, setPhoneErrorMsg] = useState("Le numéro de téléphone n'est pas valide");
    const [phoneFixedErrorMsg, setPhoneFixedErrorMsg] = useState("Le numéro de téléphone fixe n'est pas valide");
    const [linkedinErrorMsg, setLinkedinErrorMsg] = useState("Le lien n'est pas un lien linkedin");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);

    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        checkPassword: '',
        phone: 0,
        userType: 'pro'
    });

    const [query, setQuery] = useState('');
    const [option, setOptions] = useState<Competence[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const CACHE = {};

    const navigate = useNavigate();
    const {payload} = useSelector<RootState, AuthState>((state) => state.auth);

    const dispatch = useDispatch();

    const onSubmitLogin = () => {
        if (checkForm()) {
            dispatch(logIn({username: email, password}));
        }
    };

    useEffect(() => {
        const {code, content, errors} = payload;
        if (errors.length <= 0 && content.access_token.length > 0) {
            localStorage.setItem('access_token', content.access_token);
            navigate('/')
        }
    }, [payload]);


    const handleInputChange = (q: string) => {
        setQuery(q);
    };

    function makeAndHandleRequest(url: string, query: string) {
        const route = getConfig().urlHostApi;
        return fetch(`${route}${url}${query}`)
            .then((resp) => {
                return (resp.json())
            })
            .then((q: any) => {
                const options = q.content.content;
                return {options};
            });
    }

    const handleSearch = useCallback((q: string) => {
        setIsLoading(true);
        makeAndHandleRequest("/v1/public/rome/search?q=", q).then((resp) => {
            setIsLoading(false);
            setOptions(resp.options);
        });
    }, []);

    const handleSearchForOrganization = useCallback((q: string) => {
        setIsLoading(true);
        makeAndHandleRequest("/v1/public/users/organisations/search?q=", q).then((resp) => {
            setIsLoading(false);
            setOptions(resp.options);
        });
    }, []);

    const checkForm = () => {
        let email_regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
        let pwd_regex = new RegExp('(?=.{8,})(?=.*[^A-Za-z0-9])')
        if (!email_regex.test(email) || !pwd_regex.test(password) || password != checkPassword || firstName.length < 1 || lastName.length < 1) {
            if (!email_regex.test(email)) {
                setEmailError(true);
            }
            if (!pwd_regex.test(password)) {
                setPwdError(true);
            }
            if (password != checkPassword)
                setPwdCheckError(true);
            if (firstName.length < 1)
                setfirstNameError(true);
            if (lastName.length < 1)
                setlastNameError(true);
            return false;
        }
        return true;
    }

    const checkFormPhone = () => {
        let phone_regex = new RegExp("(?:(?:\\+|00)33|0)\\s*[1-9](?:[\\s.-]*\\d{2}){4}")
        if (phone_regex.test(phone.toString())) {
            return true;
        }
        setPhoneError(true);
        return false;
    }

    useEffect(() => {
        setfirstNameError(false);
        setlastNameError(false);
        setEmailError(false);
        setPwdError(false);
        setPwdCheckError(false);
        setPhoneError(false);
    }, [email, password, checkPassword, firstName, lastName, phone])

    useEffect(() => {
        if (phoneErr.phoneInputPanel)
            setPhoneError(true)
        else {
            setPhoneError(false)
        }
    }, [phoneErr]);


    const onSubmit = () => {
        if (checkForm()) {
            setStep(AuthEnum.register_step2);
        }
    }

    const handleChange = (e: any) => {
        setForm({...form, [e.target.id]: e.target.value});
        setRegisterForm(form);
    };

    useEffect(() => {
        setForm({...form, ["phone"]: phone})
        setRegisterForm(form)
    }, [phone])

    const ShowHide = ({show, onClick}: { show: boolean, onClick: () => void }) => (
        <button
            onClick={onClick}
            type="button"
            style={{textDecoration: 'underline', fontSize: 12, padding: '0 15px'}}
        >
            {show ? 'Cacher' : 'Afficher'}
        </button>
    );

    const returnRegisterForm = (step: number) => {
        if (step === AuthEnum.register_step2) {
            return (
                <div className={"sign_form-container"}>
                    <Input required type={"phone"} id={"phone"} title={"Téléphone Mobile"} doThings={setPhone}
                           hasError={phoneError} errorMsg={phoneErrorMsg} createForm={handleChange}/>
                    <Input type={"phone"} id={"phoneFixed"} title={"Téléphone Fixe"} doThings={setPhone}
                           hasError={phoneFixedError} errorMsg={phoneFixedErrorMsg} createForm={handleChange}/>
                    <Input type={"text"} id={"portfolioUrl"} title={"Lien LinkedIn"} doThings={setLinkedInUrl}
                           hasError={linkedinError} errorMsg={linkedinErrorMsg} createForm={handleChange}/>
                </div>
            )
        } else if (step === AuthEnum.register_pro) {
            return (
                <form id="register" className={"sign_form-container"}>
                    <AsyncTypeahead id="rome" className={"sign_input-typeahead"}
                                    onInputChange={handleInputChange}
                                    onSearch={handleSearch}
                                    options={option}
                                    labelKey={(opt: any) => `${opt.appellation} (${opt.codeRome})`}
                                    minLength={1}
                                    isLoading={isLoading}
                                    placeholder={"Ajoutez votre métier"}
                                    useCache={false}
                                    renderMenuItemChildren={(options) => {
                                        return (
                                            // @ts-ignore
                                            <span>{options.appellation}</span>
                                        )
                                    }}
                    />
                    <Input type={"textarea"} title={"Ajouter vos compétences"} doThings={setSkills}/>
                </form>
            )
        } else if (step === AuthEnum.join_org) {
            return (
                <form id="register" className={"sign_form-container"}>
                    <AsyncTypeahead id="rome" className={"sign_input-typeahead"}
                                    onInputChange={handleInputChange}
                                    onSearch={handleSearchForOrganization}
                                    options={option} labelKey={(opt: any) => `${opt.name}`}
                                    minLength={2}
                                    isLoading={isLoading}
                                    placeholder={"Chercher votre organisation"}
                                    useCache={false}
                                    renderMenuItemChildren={(options) => {
                                        return (
                                            // @ts-ignore
                                            <span>{options.appellation}</span>
                                        )
                                    }}
                    />
                    <Input type={"submit"} title={"Demander l'accès"} doThings={onSubmitLogin} iconName={faAngleRight}/>
                    <Input type={"submit"} title={"Passez cette étape"} doThings={onSubmitLogin}
                           iconName={faAngleRight}/>
                </form>
            )
        } else {
            return (
                <form id="register" className={"sign_form-container"}>
                    <Input
                        required
                        type={"text"}
                        id={"firstName"}
                        title={"Prénom"}
                        doThings={setfirstName}
                        hasError={firstNameError}
                        errorMsg={firstNameErrorMsg}
                        createForm={handleChange}
                    />
                    <Input
                        required
                        type={"text"}
                        id={"lastName"}
                        title={"Nom"}
                        doThings={setlastName}
                        hasError={lastNameError}
                        errorMsg={lastNameErrorMsg}
                        createForm={handleChange}
                    />
                    <Input
                        required
                        type={"text"}
                        id={"email"}
                        title={"Email"}
                        doThings={setEmail}
                        hasError={emailError}
                        errorMsg={emailErrorMsg}
                        createForm={handleChange}
                    />
                    <Input
                        required
                        type={showPassword ? 'text' : 'password'}
                        id={"password"}
                        title={"Mot de passe"}
                        doThings={setPassword}
                        hasError={pwdError}
                        errorMsg={pwdErrorMsg}
                        createForm={handleChange}
                        icon={
                            <ShowHide onClick={() => setShowPassword(prev => !prev)} show={showPassword}/>
                        }
                    />
                    <Input
                        required
                        type={showConfirmPass ? 'text' : 'password'}
                        id={"checkPassword"}
                        title={"Confirmation"}
                        doThings={setCheckPassword}
                        hasError={pwdCheckError}
                        errorMsg={pwdCheckErrorMsg}
                        createForm={handleChange}
                        icon={
                            <ShowHide onClick={() => setShowConfirmPass(prev => !prev)} show={showConfirmPass}/>
                        }
                    />
                    <Input type={"submit"} title={"Continuer"} doThings={onSubmit} iconName={faAngleRight}/>
                    <div className={"check-cgu"}>
                        <div className={"check-cgu-line"}>
                            <label><input name='condition_utilisation' type={"radio"}
                                          className={"form-check-input"}/> En cochant cette case vous acceptez <a
                                href='#' style={{color: 'inherit'}}>les conditions d'utilisation</a> de
                                StartBuilding</label>
                        </div>
                        <div className={"check-cgu-line"}>
                            <label><input name='condition_utilisation' type={"radio"}
                                          className={"form-check-input"}/> En cochant cette case vous acceptez <a
                                href='#' style={{color: 'inherit'}}>la politique de confidentialité</a> de StartBuilding</label>
                        </div>
                    </div>
                </form>
            )
        }
    }

    return (
        <>
            {returnRegisterForm(step)}
        </>
    );
}

export default RegisterForm;