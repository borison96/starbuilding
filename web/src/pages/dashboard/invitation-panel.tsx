import React, {useEffect, useState} from 'react';
import Input from "../../ui-components/input/input";
import {faAngleRight, faTimes} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useDispatch} from "../../hooks";
import {InvitationPanel, TabChange} from "../../services/redux/reducers/auth/auth.slice";
import {sendMail} from "../../services/redux/reducers/email/email.slice";

const InvitationContainer = (props:any) => {
    const { project } = props;
    const dispatch = useDispatch();
    const [emailList, setEmailList] = useState([]);
    const [hasError, setEmailError] = useState(false);
    const [hasRightError, setRightError] = useState(false);
    const [value, setValue] = useState("");

    useEffect(() => {
        setEmailError(false);
    }, [value]);

    useEffect(() => {
        setRightError(false);
    }, [emailList]);


    const handleInput = (e: React.KeyboardEvent<HTMLInputElement>, str:any) => {
        if (e.code === "Enter") {
            let email_regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
            if (!email_regex.test(str)) {
                setEmailError(true);
            } else {
                // @ts-ignore
                emailList.push({email:str, roleId:''});
                setValue('');
            }
        }
    }

    const removeEmail = (id:number) => {
        let array = [...emailList];
        array.splice(id, 1);
        setEmailList(array);
    }

    const handleRight = (e:any, id:number) => {
        let array = [...emailList];
        // @ts-ignore
        array[id].roleId = parseInt(e.target.id);
        setEmailList(array);
        console.log(emailList)
    }

    const sendEmail = () => {
        let checkmail = true;
        emailList.map((mail:any) => {
            if (mail.roleId === "") {
                checkmail = false;
            }
        })
        if (checkmail && emailList.length > 0) {
            console.log("send mail")
            dispatch(sendMail({invitations: {"invitations": emailList}, id: project}))
            closePanel();
        } else {
            setRightError(true)
            console.log("dont send mail")
        }
    }

    function closePanel() {
        dispatch(TabChange("Dashboard"));
        dispatch(InvitationPanel(false));
    }

    return (
        <>
            <div className={"pop-in_background"}>
            </div>
            <div className={"pop-in"}>
                <div className={"pop-in_container"}>
                    <p className={"title"}>Inviter des participants</p>
                    <p className={"subtitle"}>Cette étape vous permet d'inviter des utilisateurs à rejoindre ce projet.</p>
                    <div className={"content"}>
                        <div className={"input-container"}>
                            <input type={"text"}  required={true}
                                   value={value}
                                   onChange={(e) => setValue(e.target.value)}
                                   onKeyPress={(e) => {handleInput(e, e.currentTarget.value)}} />
                            { hasError && <p className={"errorMsg-popin"}>L'email n'est pas valide</p>}
                            { hasRightError && <p className={"errorMsg-popin"}>Selectionnez des droits pour chaques participants</p>}
                            <span>Saisir le mail</span>
                        </div>
                        <div className={"mail-container"}>
                            {
                                emailList.length > 0 && emailList.map((mail:{email:string, roleId:string}, id) => (
                                    <fieldset key={id} className={"email-line"}>
                                        <div className={"email"} onClick={() => {removeEmail(id)}}><span>{mail.email}</span></div>
                                        <div className={"radio-btn"}><input name={mail.email} type={"radio"} id={"1"} onClick={(e) => {handleRight(e, id)}}/><span>Administrateur</span></div>
                                        <div className={"radio-btn"}><input name={mail.email} type={"radio"} id={"2"} onClick={(e) => {handleRight(e, id)}}/><span>Membre</span></div>
                                        <div className={"radio-btn"}><input name={mail.email} type={"radio"} id={"3"} onClick={(e) => {handleRight(e, id)}}/><span>Observateur</span></div>
                                    </fieldset>
                                    )
                                )
                            }
                        </div>
                        <Input type={"submit"} light={true} title={"Bâtir ensemble"} doThings={sendEmail} iconName={faAngleRight}/>
                    </div>
                </div>
                <div>
                    <div className={"pop-in_goback"} onClick={() => closePanel()}>
                        <FontAwesomeIcon icon={faTimes} className={"icon_center"} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default InvitationContainer;
