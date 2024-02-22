import React, {useCallback, useEffect, useState} from 'react';
import RegisterForm from "./register-form";
import './login.scss';
import {faAngleRight} from "@fortawesome/free-solid-svg-icons";
import {AuthState, logIn, PhoneInputState} from "../../services/redux/reducers/auth/auth.slice";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../services/redux/store";
import {useNavigate} from "react-router-dom";
import Input from "../../ui-components/input/input";
import {getCurrentUserInfo} from "../../services/redux/reducers/user/user-reducer";
import {AuthEnum} from "./auth-enum";
import {AsyncTypeahead} from "react-bootstrap-typeahead";
import {Competence} from "../../domain/domain";
import {getConfig} from "../../utils/config";

type RegisterFormProps = {
    registered: number
    setRegister: Function
    setRegisterForm: Function
};

const SignForm = ({registered, setRegister, setRegisterForm}: RegisterFormProps) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [pwdError, setPwdError] = useState(false);
    const [emailErrorMsg, setEmailErrorMsg] = useState("L'email n'est pas valide");
    const [pwdErrorMsg, setPwdErrorMsg] = useState("Le mot de passe n'est pas valide");

    const [query, setQuery] = useState('');
    const [option, setOptions] = useState<Competence[]>([]);
    const [value, setValue] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const {payload} = useSelector<RootState, AuthState>((state) => state.auth);

    const dispatch = useDispatch();

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
            dispatch(logIn({ username:email, password }));
        }
    };

    const onSubmitOrg = () => {
        if (value.length < 1) {
            console.log(query)
        } else {
            console.log(value)
            navigate('/');
        }
    }

    useEffect(() => {
        const {code, content, errors} = payload;
        if (errors.length <= 0 && content.access_token.length > 0) {
            localStorage.setItem('access_token', content.access_token);
            setRegister(AuthEnum.choose_org);
        }
    }, [payload]);

    useEffect(() => {
        setEmailError(false);
        setPwdError(false);
    }, [email, password])


    function makeAndHandleRequest(url:string ,query:string) {
        const route = getConfig().urlHostApi;
        return fetch(`${route}${url}${query}`)
            .then((resp) => {
                return (resp.json())
            })
            .then((q: any) => {
                const options = q.content.content;
                return { options };
            });
    }

    const handleSearchForOrganization = useCallback((q: string) => {
        setIsLoading(true);
        makeAndHandleRequest("/v1/public/users/organisations/search?q=", q).then((resp) => {
            setIsLoading(false);
            setOptions(resp.options);
        });
    }, []);

    const LoginForm = () => {
        if (registered === AuthEnum.login) {
            return (
                <div id="login" className={"sign_form-container"}>
                    { payload.errors.length > 0  &&
                        <span className={"errorMsg"}>L'email ou le mot de passe est incorrect</span>}
                    <Input type={"text"} title={"Email"} doThings={setEmail} hasError={emailError} errorMsg={emailErrorMsg} />
                    <Input type={"password"} title={"Mot de passe"} doThings={setPassword} hasError={pwdError} errorMsg={pwdErrorMsg}/>
                    <Input type={"submit"} title={"Continuer"} doThings={onSubmit} iconName={faAngleRight}/>
                </div>
            )
        } else {
            return (
                <div id="login" className={"sign_form-container"}>
                    <AsyncTypeahead id="rome" className={"sign_input-typeahead"}
                                    onInputChange={(e) => {setQuery(e)}}
                                    onChange={(e) => setValue(e)}
                                    onSearch={handleSearchForOrganization}
                                    options={option} labelKey={"name"}
                                    minLength={1}
                                    isLoading={isLoading}
                                    placeholder={"Chercher votre organisation"}
                                    useCache={false}
                                    renderMenuItemChildren={(options) =>{
                                        return(
                                            // @ts-ignore
                                            <span>{options.name}</span>
                                        )
                                    }}
                    />
                    <Input type={"submit"} title={"Continuer"} doThings={onSubmitOrg} iconName={faAngleRight}/>
                </div>
            )
        }
    }

    return (
        <>
        { registered === AuthEnum.login || registered === AuthEnum.choose_org ? (
            LoginForm()
        ): (
            <>
                <RegisterForm step={registered} setStep={setRegister} setRegisterForm={setRegisterForm}/>
            </>
        )
        }
        </>
    );
};


export default SignForm;
