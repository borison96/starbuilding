import React from 'react';
import apple from "../../asset/svg/apple.svg";
import google from "../../asset/svg/google.svg";
import linkedin from "../../asset/svg/linkedin.svg";

const SocialLogin = () => {
    return (
        <div className="sign_form-container">
            <div className={"sign_input-container-fgl disabled"}>
                <input type="button" required={true}/>
                <img src={apple} className={"icon"}/>
                <span>Continuer avec Apple</span>
            </div>
            <div className={"sign_input-container-fgl disabled"}>
                <input type="button" required={true}/>
                <img src={google} className={"icon"}/>
                <span>Continuer avec Google</span>
            </div>
            <div className={"sign_input-container-fgl disabled"}>
                <input type="button" required={true}/>
                <img src={linkedin} className={"icon"}/>
                <span>Continuer avec LinkedIn</span>
            </div>
        </div>
    );
};

export default SocialLogin;
