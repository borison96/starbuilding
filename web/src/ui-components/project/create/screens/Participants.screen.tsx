import { useMemo, useState } from "react";
import EmailService from "../../../../api/service/email-service/email-service";
import { validator } from "../../../../utils";
import Button from "../../../controls/button/Button.component";
import Crumb from "../../../controls/crumb/Crumb.component";
import InlineSelect, { InlineSelectChangeDataType } from "../../../controls/inline-select/InlineSelect.component";
import Input from "../../../input/input";
import { ScreenPropType } from "../prop-types";
type ParticipantType = { email: string; roleId: any, ms?: number };
function ParticipantsScreen({ onNext, entrance, exit, roles, project }: ScreenPropType) {
    const [participants, setParticipants] = useState<{[key:string]: ParticipantType }>({});
    const [email, setEmail] = useState('');
    const [roleError, setRoleError] = useState('');
    const [emailError, setEmailError] = useState('');
    const handleContinue = () => {
        if (email !== '') setEmailError(`${validator.isEmail(email) ? 'Veuillez appuyer sur Entrée si vous souhaitez inviter ' + email : `email ${email} invalide` }`);
        try {
            Object.values(participants).forEach((part) => {
                if (!part.roleId) throw Error('Veuillez sélectionner un rôle pour chaque participant');
            });
            if (project?.id) {
                EmailService.sendEmail(project.id, { invitations: Object.values(participants)});
            }
            if (email === '') onNext({});
        } catch(e: any) {
            setRoleError(e?.message ?? '');
        }
    }
    const handleAddParticipant = (e:any) => {
        if ((e?.key && e?.key?.toLowerCase() === 'enter' || !e?.key) && validator.isEmail(email)) {
            setParticipants((prev) => ({...prev, [email]: { email, roleId: 0, ms: Date.now()}}));
            setEmail('');
            setRoleError('');
            setEmailError('');
        }
    }
    const handleEmailChange = (e: any) => {
        setEmail(e?.target?.value);
        if (roleError) setRoleError('');
        if (emailError) setEmailError('');
    }
    const handleRemoveParticipant = (val: string) => {
        setParticipants((prev) => {
            const state = {...prev};
            delete state[val];
            return state;
        });
    };
    const handleParticipantRoleChange = (val: InlineSelectChangeDataType, target: any) => {
        setParticipants((prev) => ({...prev, [target.email]: { email: target.email, roleId: val.target.value, ms: target.ms }}));
    }
    const sortParticipants = (a: ParticipantType, b: ParticipantType) => {
        if (a.ms && b.ms) {
            return a.ms > b.ms ? -1 : 1
        }
        return -1;
    }
    const pArr = useMemo(() => Object.values(participants).sort(sortParticipants), [participants]);
    return (
        <div className={`proj-screen__container ${entrance ? 'entrance' : ''} ${exit ? 'exit' : ''}`}>
            <h3 className="proj-screen__title">Inviter des participants</h3>
            <h5 className="proj-screen__title">Cette étape vous permet d’inviter des utilisateurs à rejoindre ce projet.</h5>
            <Input onKeyDown={handleAddParticipant} value={email} onChange={handleEmailChange} style={{ with: '80%' }} containerClassName="proj-screen__input" title="Saisir une adresse email" icon={
                <svg onClick={handleAddParticipant} tabIndex={0} role="button" className="plus-svg-54" viewBox="0 0 100 100" fill="#F3BE3D">
                    <circle cx={50} cy={50} r={50}></circle>
                    <text textAnchor="middle" x={50} y={75} fill="#fff" fontSize={100}>+</text>
                </svg>
            } />
            {
                pArr.length > 0 ? pArr.map((participant) => (
                    <div key={participant.email} style={{ display: 'flex', alignItems: 'center'}}>
                        <Crumb value={participant.email} onDismiss={handleRemoveParticipant}/>
                        <InlineSelect onChange={(data) => handleParticipantRoleChange(data, participant)} type="radio" options={
                            roles ? roles.map(r => ({ value: r.id, label: r.name, description: r.description })) : []
                        } />
                    </div>
                )) : null
            }
            {
                roleError && pArr.length > 0 ? (<span style={{ color: '#E33F1A' }}>{roleError}</span>) : null
            }
            {
                !roleError && emailError ? (<span style={{ color: '#E33F1A' }}>{emailError}</span>) : null
            }
            <Button onClick={handleContinue} round btnClassName="proj-continue-btn" icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5.067 8.137" style={{ transform: 'rotate(175deg)' }}>
                    <path id="Flèche-chevron-s" d="M3.438,2.488,1.2,4.775a.683.683,0,0,1-1,0,.782.782,0,0,1,0-1.055L3.6.2A.581.581,0,0,1,4.033,0h.262A.525.525,0,0,1,4.6.2L7.932,3.795a.782.782,0,0,1,0,1.055.683.683,0,0,1-1,0L4.889,2.639C4.306,2.245,4.053,2.132,3.438,2.488Z" transform="translate(0 8.137) rotate(-90)" fill="#fff" fillRule="evenodd"/>
                </svg>           
            }>
                { pArr.length > 0 ? 'Inviter ces participants' : 'Continuer' }
            </Button>
        </div>
    );
}

export default ParticipantsScreen;
