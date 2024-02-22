import { useEffect, useState } from "react";
import Button from "../../../controls/button/Button.component";
import Input from "../../../input/input";
import { ScreenPropType } from "../prop-types";

function MarketScreen({ onNext, onSave, entrance, exit, projectData }: ScreenPropType) {
    const [workType, setWorkType] = useState('');
    const [marketType, setMarketType] = useState('');
    const [team, setTeam] = useState('');
    const [teamRoleId, setTeamRoleId] = useState('');
    useEffect(() => {
     setWorkType(projectData?.workType ?? '');
     setMarketType(projectData?.marketType ?? '');
     setTeam(projectData?.team ?? '');
     setTeamRoleId(projectData?.teamRoleId ?? '');
    }, []);
    const handleContinue = () => {
        onNext({ workType, marketType, team, teamRoleId });
        if (onSave) onSave({ workType, marketType, team, teamRoleId });
    }
    return (
        <div className={`proj-screen__container ${entrance ? 'entrance' : ''} ${exit ? 'exit' : ''}`}>
            <h3 className="proj-screen__title">Dites nous en plus</h3>
            <h5 className="proj-screen__title">sur votre projet</h5>
            <Input value={workType} onChange={(e: any) => setWorkType(e?.target.value)} containerClassName="proj-screen__input" title="Typologie de l’ouvrage" />
            <Input value={marketType} onChange={(e: any) => setMarketType(e?.target.value)} containerClassName="proj-screen__input" title="Type de marché" />
            <h5 className="proj-screen__title">sur vous</h5>
            <Input value={team} onChange={(e: any) => setTeam(e?.target.value)} containerClassName="proj-screen__input" title="Dans quelle équipe intervenez-vous?" />
            <Input value={teamRoleId} onChange={(e: any) => setTeamRoleId(e?.target.value)} containerClassName="proj-screen__input" title="Quel sera votre rôle au sein de l’équipe?" />
            <Button onClick={handleContinue} round btnClassName="proj-continue-btn" icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5.067 8.137" style={{ transform: 'rotate(175deg)' }}>
                    <path id="Flèche-chevron-s" d="M3.438,2.488,1.2,4.775a.683.683,0,0,1-1,0,.782.782,0,0,1,0-1.055L3.6.2A.581.581,0,0,1,4.033,0h.262A.525.525,0,0,1,4.6.2L7.932,3.795a.782.782,0,0,1,0,1.055.683.683,0,0,1-1,0L4.889,2.639C4.306,2.245,4.053,2.132,3.438,2.488Z" transform="translate(0 8.137) rotate(-90)" fill="#fff" fillRule="evenodd"/>
                </svg>           
            }>
                Continuer
            </Button>
        </div>
    );
}

export default MarketScreen;
