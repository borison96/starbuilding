import { useCallback, useMemo, useState } from "react";
import { AsyncTypeahead } from "react-bootstrap-typeahead";
import { useTranslation } from "react-i18next";
import { Competence } from "../../../../domain/domain";
import Crumb from "../../../../ui-components/controls/crumb/Crumb.component";
import CirclePlusIcon from "../../../../ui-components/icons/CirclePlus.icon";
import Input from "../../../../ui-components/input/input";
import { searchCompetence } from "../../api";
import { StepsPropsType } from "./types";

const CompetenceStep = ({ onChange, data, errors }: StepsPropsType) => {
    const { t } = useTranslation();
    const [query, setQuery] = useState('');
    const [option, setOptions] = useState<Competence[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [skills, setSkills] = useState<{ [key: string]: string}>({});
    const [skill, setSkill] = useState('');
    const [professions, setProfessions] = useState<{ [key: string]: Competence}>({});
    const [selectedProfession, setSelectedProfession] = useState<Competence>();

    const handleChange = (e: any) => {
        if(onChange && e?.target) onChange({ [e.target.name]: e.target.value });
    };
    const handleInputChange = (q: string) => {
        setQuery(q);
    };
    const handleSearchForProfession = useCallback((q: string) => {
        setIsLoading(true);
        searchCompetence(q).then((resp) => {
            setIsLoading(false);
            setOptions(resp);
        });
    }, []);
    const handleSelectionChange = (selected: any) => {
        if (Array.isArray(selected) && selected.length) {
            setSelectedProfession(selected[0]);
            setQuery(selected[0].appellation);
        };
    };
    const handleSelectionSet = (e: any) => {
        if ((e?.key && e?.key?.toLowerCase() === 'enter' || !e?.key)) {
            setProfessions((prev: any) => {
                setQuery('');
                return { ...prev, ...(selectedProfession ? { [selectedProfession.appellation]: selectedProfession } : {})}
            });
        }
    }
    const professionArr = useMemo(() => Object.values(professions), [professions]);
    const skillsArr = useMemo(() => Object.values(skills), [skills]);
    const handleDismissProfession = (val:any) => {
        setProfessions((prev: any) => {
            const it = { ...prev };
            delete it[val];
            return it;
        });
    }
    const handleSetSkill = (e:any) => {
        if ((e?.key && e?.key?.toLowerCase() === 'enter' || !e?.key)) {
            if(skill) setSkills((prev: any) => ({ ...prev, [skill.toLowerCase()]: skill }));
            setSkill('');
        }
    };
    const handleDismissSkill = (val:any) => {
        setSkills((prev: any) => {
            const it = { ...prev };
            delete it[val?.toLowerCase()];
            return it;
        });
    }

    return (
        <div className="sign_form-container">
            <AsyncTypeahead
                id="competence-search"
                className="auth-input-typeahead"
                onInputChange={handleInputChange}
                onChange={handleSelectionChange}
                onSearch={handleSearchForProfession}
                options={option}
                labelKey={(opt: any) => `${opt.appellation} (${opt.codeRome})`}
                minLength={1}
                isLoading={isLoading}
                useCache={false}
                renderMenuItemChildren={(opt: any) =>{
                    return(
                        <span>{`${opt.appellation} (${opt.codeRome})`}</span>
                    )
                }}
                renderInput={({ inputRef, referenceElementRef, ...inputProps }) => (
                    <Input
                      {...inputProps}
                      ref={(input:any) => {
                        inputRef(input);
                        referenceElementRef(input);
                      }}
                      title={t('add-profession')}
                      icon={<CirclePlusIcon background="#959595" style={{ marginRight: 5 }} onClick={handleSelectionSet} />}
                      onKeyDown={handleSelectionSet}
                      value={query}
                    />
                  )}
            />
            {
                professionArr.length > 0 ? (
                    <div style={{ marginTop: 15, display: 'flex', flexWrap: 'wrap' }}>
                        { professionArr.map((prof) => <Crumb background="#fff" key={prof.appellation} value={prof.appellation} onDismiss={handleDismissProfession} />) }
                    </div>
                ) : null
            }
            <Input
                type="textarea" title={t('add-skills')}
                value={skill}
                onChange={(e:any) => setSkill(e?.target?.value)}
                icon={<CirclePlusIcon onClick={handleSetSkill}  background="#959595" style={{ marginRight: 5 }} />}
                onKeyDown={handleSetSkill}
            />
            {
                skillsArr.length > 0 ? (
                    <div style={{ marginTop: 15, display: 'flex', flexWrap: 'wrap' }}>
                        { skillsArr.map((skill) => <Crumb background="#fff" key={skill} value={skill} onDismiss={handleDismissSkill} />) }
                    </div>
                ) : null
            }
        </div>
    )
};

export default CompetenceStep;
