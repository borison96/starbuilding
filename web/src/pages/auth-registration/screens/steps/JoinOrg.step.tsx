import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Organisation } from "../../../../domain/domain";
import SearchIcon from "../../../../ui-components/icons/Search.icon";
import Input from "../../../../ui-components/input/input";
import { requestToJoin, searchOrg } from "../../api";
import { StepsPropsType } from "./types";
import Button from "../../../../ui-components/controls/button/Button.component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SelectOrgCard from "../../../../ui-components/org/SelectOrgCard.component";
import { Spinner } from "react-bootstrap";

const JoinOrgStep = ({ onNext, data, onComplete }: StepsPropsType) => {
    const { t } = useTranslation();
    const [query, setQuery] = useState('');
    const [options, setOptions] = useState<Organisation[]>([]);
    const [selectedOrg, setSelectedOrg] = useState<Organisation | {[key: string]: any}>({});
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const debounceId = useRef<any>();

    const handleSearchForOrganization = (e:any) => {
        e?.stopPropagation();
        if (e) clearTimeout(debounceId.current);
        if ((e?.key && e?.key?.toLowerCase() === 'enter' || !e?.key) && query) {
            setIsLoading(true);
            searchOrg(query).then((resp) => {
                setIsLoading(false);
                setOptions(resp);
            });
        }
    };
    const handleQueryChange = (e: any) => {
        e?.stopPropagation();
        setQuery(e?.target?.value);
        clearTimeout(debounceId.current);
        debounceId.current = setTimeout(handleSearchForOrganization, 1000);
    }
    const handleSelectOrg = (org: any) => {
        setSelectedOrg(org);
        setErrorMsg('');
    }
    const handleJoinRequest = () => {
        if (selectedOrg.id) {
            if (data?.email) {
                requestToJoin(selectedOrg.id, data?.email).then(
                    (resp:any) => {
                        if (Array.isArray(resp?.errors) && resp?.errors?.length > 0) setErrorMsg(t('request-not-sent'));
                        else if(onNext) onNext({ selectedOrg });
                    }
                ).catch((err: any) => {
                    setErrorMsg(t('request-not-sent'));
                })
            } else {
                setErrorMsg(t('cant-join-rather-connect'));
            }
        } else {
            setErrorMsg(t('select-org-error'));
        }
    }
    const handlSkip = () => {
        if(onComplete) onComplete({});
    }
    return (
        <div>
            <Input
                type="text"
                title={t('find-your-organisation')}
                onChange={handleQueryChange}
                onKeyDown={handleSearchForOrganization}
                icon={
                    isLoading ? (
                        <Spinner animation="border" style={{ marginRight: 15 }} variant="secondary" />
                    ) : (
                        <SearchIcon background="#959595" style={{ transform: 'scale(1.4)', marginRight: 15 }} onClick={handleSearchForOrganization} />
                    )
                }
            />
            {
                options.length > 0 ? (
                    <>
                        <div style={{ maxHeight: 500, overflowY: 'auto', padding: '0 20px' }}>
                            <p style={{ textDecoration: 'underline', margin: '30px 15px' }}>{t('organisation-found')} :</p>
                            {
                                options.map((org: Organisation) => (
                                    <SelectOrgCard org={org} selected={selectedOrg?.id} key={org.id} onClick={() => handleSelectOrg(org)} />
                                ))
                            }
                        </div>
                        { errorMsg ? <p style={{ color: '#E33F1A', fontSize: 12, textAlign: 'center' }}>{errorMsg}</p> : null}
                        <Input type="submit" iconName={faAngleRight} title={t('request-access')} onClick={handleJoinRequest} />
                    </>
                ) : null
            }
            <Button onClick={handlSkip} style={{ border: '1px solid #959595', background: '#EBEBEB' }} round icon={<FontAwesomeIcon icon={faAngleRight} />}>{t('skip-step')}</Button>
        </div>
    )
}

export default JoinOrgStep;
