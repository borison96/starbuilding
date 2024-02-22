import { Organisation } from "../../domain/domain";
import architecture from '../../asset/svg/architecture.svg';
import './org-cards.scss';

const SelectOrgCard = ({ org, selected, onClick }: { org: Organisation, selected: number | string,  onClick?: (org: Organisation) => void }) => {
    return (
        <div className={`select-org-card ${org.id === selected ? 'selected' : ''}`} tabIndex={0} role="button" onClick={() => onClick ? onClick(org) : null}>
            <div style={{ flex: '1 100px'}}>
                <img alt={org.name ?? ''} src={org.picture ?? architecture} style={{ width: '40%', objectFit: 'cover', objectPosition: 'top' }} />
            </div>
            <div title={org.address} style={{ flex: '1 300px'}}>
                <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{org.corporateName ?? org.name}</div>
                { org.code || org.description || org.address ?
                    <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {org.description || org.address || org.code}
                    </div>
                    : null
                }
            </div>
        </div>
    );
};

export default SelectOrgCard;
