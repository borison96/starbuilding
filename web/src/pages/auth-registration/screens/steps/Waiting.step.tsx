import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Input from "../../../../ui-components/input/input";
import { StepsPropsType } from "./types";
import architecture from '../../../../asset/svg/architecture.svg';
import { useNavigate } from "react-router-dom";
import { paths } from "../../../../routes";

const WaitingStep = ({ data }: StepsPropsType) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState('');
    const handleTryApp = () => {
        if (data?.selectedOrg?.id && data.email) {
            navigate(paths.DASHBOARD);
        } else {
            setErrorMsg(t('cant-join-rather-connect'));
        }
    }

    return (
        <div>
            {
                data?.selectedOrg ? (
                    <>
                        <p style={{ textDecoration: 'underline', margin: '30px 15px' }}>{t('your-organisation')} :</p>
                        <div className="select-org-card">
                            <div style={{ flex: '1 100px'}}>
                                <img alt={data.selectedOrg.name ?? ''} src={data.selectedOrg.picture ?? architecture} style={{ width: '40%', objectFit: 'cover', objectPosition: 'top' }} />
                            </div>
                            <div title={data.selectedOrg.address} style={{ flex: '1 300px'}}>
                                <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{data.selectedOrg.corporateName ?? data.selectedOrg.name}</div>
                                { data.selectedOrg.code ? <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{data.selectedOrg.code}</div> : null }
                            </div>
                        </div>
                    </>
                ): null
            }
            {
                data?.email ? (
                    <p style={{ textDecoration: 'underline', margin: '30px 15px' }}>{t('your-email')} : {data.email} </p>
                ) : null
            }
            { errorMsg ? <p style={{ color: '#E33F1A', fontSize: 12, textAlign: 'center' }}>{errorMsg}</p> : null}
            <Input type="submit" iconName={faAngleRight} title={t('try-app')} onClick={handleTryApp} />
        </div>
    )
}

export default WaitingStep;
