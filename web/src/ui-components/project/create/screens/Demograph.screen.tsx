import { useEffect, useState } from "react";
import Button from "../../../controls/button/Button.component";
import InlineSelect from "../../../controls/inline-select/InlineSelect.component";
import Input from "../../../input/input";
import { ScreenPropType } from "../prop-types";

function Demograph({ onNext, entrance, exit, projectData }: ScreenPropType) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [contractor, setContractor] = useState('');
    const [contractorEmail, setContractorEmail] = useState('');
    const [iamContractor, setIamContractor] = useState(true);
    useEffect(() => {
     setName(projectData?.name ?? '');
     setDescription(projectData?.description ?? '');
     setContractor(projectData?.contractor ?? '');
     setContractorEmail(projectData?.contractorEmail ?? '');
    }, []);
    const handleContinue = () => {
        if (name.trim() !== '' && description.trim() !== '') {
            onNext({ name, description, contractor, contractorEmail });
        }
    }
    
    return (
        <div className={`proj-screen__container ${entrance ? 'entrance' : ''} ${exit ? 'exit' : ''}`}>
            <h3 className="proj-screen__title">Parlez nous de votre projet</h3>
            <Input required value={name} onChange={(e: any) => setName(e?.target.value)} containerClassName="proj-screen__input" title="Nom du projet" />
            <Input required value={description} onChange={(e: any) => setDescription(e?.target.value)} containerClassName="proj-screen__input" title="Décrivez le en une phrase" />
            <InlineSelect
                options={[
                    { label: 'Oui', value: 1, checked: true },
                    { label: 'Non', value: 0 }
                ]}
                title="Serez vous le maître d’ouvrage du projet?"
                type="radio"
                checked={0}
                onChange={(data) => setIamContractor(data.target.value === 1)}
            />
            {
                !iamContractor ? (
                    <>
                        <Input
                            value={contractor}
                            onChange={(e: any) => setContractor(e?.target.value)}
                            containerClassName="proj-screen__input"
                            title="Nom de la Maîtrise d’ouvrage"
                        />
                        <Input
                            value={contractorEmail}
                            onChange={(e: any) => setContractorEmail(e?.target.value)}
                            containerClassName="proj-screen__input"
                            title="Adresse mail du Maître d’ouvrage"
                            type="email"
                        />
                    </>
                ) : null
            }
            <Button onClick={handleContinue} round btnClassName="proj-continue-btn" icon={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5.067 8.137" style={{ transform: 'rotate(175deg)' }}>
                    <path id="Flèche-chevron-s" d="M3.438,2.488,1.2,4.775a.683.683,0,0,1-1,0,.782.782,0,0,1,0-1.055L3.6.2A.581.581,0,0,1,4.033,0h.262A.525.525,0,0,1,4.6.2L7.932,3.795a.782.782,0,0,1,0,1.055.683.683,0,0,1-1,0L4.889,2.639C4.306,2.245,4.053,2.132,3.438,2.488Z" transform="translate(0 8.137) rotate(-90)" fill="#fff" fillRule="evenodd"/>
                </svg>           
            }>
                Continuer
            </Button>
        </div>
    )
}

export default Demograph;
