import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { OrganisationService } from "../../../api/service/org-service";
import { Organisation } from "../../../domain/domain";
import { useDispatch, useSelector } from "../../../hooks";
import { paths } from "../../../routes";
import { clearOrganisation, setOrganisation } from "../../../services/redux/reducers/org";
import Button from "../../../ui-components/controls/button/Button.component";
import SearchIcon from "../../../ui-components/icons/Search.icon";
import Input from "../../../ui-components/input/input";
import SelectOrgCard from "../../../ui-components/org/SelectOrgCard.component";
import { requestToJoin, searchOrg } from "../api";

const SelectOrgScreen = ({ onSubmitOrg, selectedOrg, setSelectedOrg }: {
    onSubmitOrg: () => void,
    selectedOrg: Organisation,
    setSelectedOrg: (org: Organisation) => void
}) => {
    const { t } = useTranslation();
    const [query, setQuery] = useState('');
    const [options, setOptions] = useState<Organisation[]>([]);
    const [value, setValue] = useState<any>([]);
    const [createdOrgs, setCreatedOrgs] = useState<Organisation[]>([]);
    const [joinedOrgs, setJoinedOrgs] = useState<Organisation[]>([]);
    const [createdOrgPage, setCreatedOrgPage] = useState(0);
    const [joinedOrgPage, setJoinedOrgPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [joinErrorMessage, setJoinErrorMessage] = useState('');

    const debounceId = useRef<any>();
    const timeoutId = useRef<any>();

    const [, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    useEffect(() => {
        if (user) {
            clearTimeout(timeoutId.current);
        } else {
            clearTimeout(timeoutId.current);
            timeoutId.current = setTimeout(() => navigate(paths.AUTH + '/login'), 300);
        }
    }, [user]);
    useEffect(() => {
        OrganisationService.listCreated(createdOrgPage).then(
            (res) => {
                if (res?.data?.content) {
                 setCreatedOrgs(res?.data?.content?.content ?? []);
                }
            }
        );
    }, [createdOrgPage]);
    useEffect(() => {
        OrganisationService.listJoined(createdOrgPage).then(
            (res) => {
                if (res?.data?.content) {
                 setJoinedOrgs(res?.data?.content?.organisations ?? []);
                }
            }
        );
    }, [joinedOrgPage]);
    const handleSearchForOrganization = (e: any) => {
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
    const handleSelectOrg = (org: Organisation, knownMembership: boolean = true) => {
        setSelectedOrg(org);
        if (knownMembership) {
            dispatch(setOrganisation(org));
            navigate(paths.DASHBOARD);
        }
        else {
            OrganisationService.isMember(org?.id?.toString()).then(
                (res) => {
                    if (!Array.isArray(res.data?.errors) || res.data?.errors?.length < 1) {
                        dispatch(setOrganisation(org));
                        navigate(paths.DASHBOARD);
                    }
                }
            )
        }
    }
    const handleJoinRequest = () => {
        if (selectedOrg?.id) {
            if (user?.email) {
                requestToJoin(selectedOrg?.id, user?.email).then(
                    (resp:any) => {
                        if (Array.isArray(resp?.errors) && resp?.errors?.length > 0) setJoinErrorMessage(t('request-not-sent'));
                        else setSearchParams({ step: '5'});
                    }
                ).catch((err: any) => {
                    setJoinErrorMessage(t('request-not-sent'));
                })
            } else {
                setJoinErrorMessage(t('cant-join-rather-connect'));
            }
        } else {
            setJoinErrorMessage(t('select-org-error'));
        }
    }
    const handleSubmitOrg = () => {
        dispatch(clearOrganisation());
        onSubmitOrg();
    }
    return (
        <>
            <div className="org-select-cc">
                {
                    createdOrgs?.length > 0 ? (
                        <div style={{ maxHeight: 500, overflowY: 'auto', overflowX: 'hidden', padding: '0 20px' }} className="auth-content-cc">
                            <p style={{ textDecoration: 'underline', margin: '30px 15px' }}>{t('created-orgs')} :</p>
                            {
                                createdOrgs.map((org: Organisation) => (
                                    <SelectOrgCard org={org} selected={selectedOrg?.id ?? ''} key={org.id} onClick={() => handleSelectOrg(org)} />
                                ))
                            }
                        </div>
                    ) : null
                }
                {
                    joinedOrgs?.length > 0 ? (
                        <div style={{ maxHeight: 500, overflowY: 'auto', overflowX: 'hidden', padding: '0 20px' }} className="auth-content-cc">
                            <p style={{ textDecoration: 'underline', margin: '30px 15px' }}>{t('joined-orgs')} :</p>
                            {
                                joinedOrgs.map((org: any) => (
                                    <SelectOrgCard org={org} selected={selectedOrg?.id ?? ''} key={org.id} onClick={() => handleSelectOrg(org)} />
                                ))
                            }
                        </div>
                    ) : null
                }
            </div>
            <div className="auth-content-cc-cc">
                <div className="auth-content-cc align-center">
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
                        options?.length > 0 ? (
                            <div style={{ marginBottom: 15 }}>
                                <div style={{ maxHeight: 500, overflowY: 'auto', padding: '0 20px' }}>
                                    <p style={{ textDecoration: 'underline', margin: '30px 15px' }}>{t('organisation-found')} :</p>
                                    {
                                        options.map((org: Organisation) => (
                                            <SelectOrgCard org={org} selected={selectedOrg?.id} key={org.id} onClick={() => handleSelectOrg(org, false)} />
                                        ))
                                    }
                                </div>
                                { joinErrorMessage ? <p style={{ color: '#E33F1A', fontSize: 12, textAlign: 'center' }}>{joinErrorMessage}</p> : null}
                                <Input type="submit" iconName={faAngleRight} title={t('request-access')} onClick={handleJoinRequest} />
                            </div>
                        ) : null
                    }
                </div>
                <div className="flex-content">
                    <div style={{ flex: 1, margin: 5 }}>
                        <Button
                            onClick={() => setSearchParams({ step: 'create_org' })}
                            style={{ border: '1px solid #959595', background: '#1E2432', color: '#fff' }}
                            round
                            icon={<FontAwesomeIcon icon={faAngleRight} />}
                        >{t('create_organisation')}</Button>
                    </div>
                    <div style={{ flex: 1, margin: 5 }}>
                        <Button onClick={handleSubmitOrg} style={{ border: '1px solid #959595', background: '#EBEBEB' }} round icon={<FontAwesomeIcon icon={faAngleRight} />}>{t('skip-step')}</Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SelectOrgScreen;
