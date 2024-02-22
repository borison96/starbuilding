import { OrgJoinRequest } from "../../domain/domain";
import architecture from '../../asset/svg/user.svg';
import { useTranslation } from "react-i18next";
import './org-cards.scss';
import Button from "../controls/button/Button.component";
import { OrganisationService } from "../../api/service/org-service";
import { useDispatch } from "../../hooks";
import { setOrganisation } from "../../services/redux/reducers/org";
export interface OrgJoinRequestCardProp {
    joinRequest: OrgJoinRequest;
    id: number | string;
}

const OrgJoinRequestCard = ({ joinRequest, id }: OrgJoinRequestCardProp) => {
    const userName = (() => {
        let username = '';
        if (joinRequest.user?.firstName) username += joinRequest.user?.firstName;
        if (joinRequest.user?.lastName) username += " " + joinRequest.user?.lastName;
        return username;
    })();
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const onAccept = () => {
        OrganisationService.acceptJoinRequest(id, joinRequest.token).then((res) => {
            if (Array.isArray(res?.data?.errors) && res?.data?.errors?.length > 0) {

            } else if (res?.data?.content) {
                dispatch(setOrganisation(res?.data?.content));
            }
        });
    }
    const onDecline = () => {
        OrganisationService.rejectJoinRequest(id, joinRequest.token).then((res) => {
            if (Array.isArray(res?.data?.errors) && res?.data?.errors?.length > 0) {

            } else if (res?.data?.content) {
                dispatch(setOrganisation(res?.data?.content));
            }
        });
    }
    return (
        <div className={'select-org-card'}>
            <div style={{ flex: 1, marginRight: 5 }}>
                <img alt={''} src={architecture} style={{ width: 40, objectFit: 'cover', objectPosition: 'top' }} />
            </div>
            <div title={userName} style={{ flex: '2 200px'}}>
                {
                    userName && (
                        <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{userName}</div>
                    )
                }
                { joinRequest?.user?.email ?
                    <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {joinRequest?.user?.email}
                    </div>
                    : null
                }
                <div style={{ color: '#888', fontSize: 10 }}>
                    <span style={{ marginRight: 10 }}>
                        {(new Date(joinRequest.createdAt))?.toDateString()}
                    </span>
                    <span>
                        {t('expires-in')}
                        {' '}
                        { joinRequest.expiresInDays }
                        {' '}
                        {t('days')}
                    </span>
                </div>
            </div>
            <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap' }}>
                <Button
                    style={{ background: 'transparent', display: 'flex', justifyContent: 'center', alignItems: 'center', width: 100 }}
                    onClick={onDecline}
                >
                    {t('decline')}
                </Button>
                <Button
                    round
                    style={{ border: '1px solid #295EA7', background: 'transparent', color: '#295EA7', display: 'flex', justifyContent: 'center', alignItems: 'center', width: 100 }}
                    onClick={onAccept}
                >
                    {t('accept')}
                </Button>
            </div>
        </div>
    );
};

export default OrgJoinRequestCard;
