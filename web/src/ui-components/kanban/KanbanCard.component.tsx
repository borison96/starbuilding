import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import icons from '../../asset/svg';
import { EditableCell } from '../commons/table';
import DateSelect from '../controls/date-select/DateSelect.component';
import './kanban.scss';
export interface KanbanCardProp {
    assignees?: Array<any>;
    color?: string;
    content?: any;
    data?: string;
    format?: string;
    description?: string;
    dragging: false
    durationInSeconds?: number;
    iconName?: string;
    id?: string;
    latitude?: number;
    longitude?: number;
    nodeType?: string;
    parentId?: number;
    removeCard?: (props: any) => void;
    reporter?: any;
    startsAt?: number;
    endsAt?: number;
    status?: string;
    title?: string;
    restricted?: boolean;
    watchers?: Array<any>;
    onChange?: (props: any) => void;
    showDates?: boolean;
};
type IconName = keyof typeof icons;

const KanbanCard = ({ title, startsAt, endsAt, description, iconName, nodeType, restricted, onChange, parentId, id, showDates }: KanbanCardProp) => {
    const [name, setName] = useState<string>('');
    const [localDescription, setLocalDescription] = useState<string>('');
    const { t } = useTranslation();
    useEffect(() => {
        setName(title);
    }, [title]);
    useEffect(() => {
        setLocalDescription(description);
    }, [description]);
    let icon = icons.question;
    if (iconName in icons) {
      icon = icons[iconName as IconName];
    } else if (nodeType in icons) {
      icon = icons[nodeType as IconName];
    }
    const handleChangeTitle = (val: string) => {
        if (onChange) {
            onChange({ id, parentId, name: val });
        }
    }
    const handleChangeDescription = (val: string) => {
        if (onChange) {
            onChange({ id, parentId, description: val });
        }
    }
    const handleStartDateChange = (val: Date) => {
        if (onChange) {
            onChange({ id, parentId, startsAt: val.getTime() });
        }
    }
    const handleDueDateChange = (val: Date) => {
        if (onChange) {
            onChange({ id, parentId, endsAt: val.getTime() });
        }
    }
    return (
        <div className="react-kanban-card react-kanban-card__container" id={`kanban-card-${id}`}>
            <span>
                <div className="react-kanban-card__title" style={{ marginTop: 8 }}>
                    <div style={{ textTransform: 'capitalize' }}>
                        <EditableCell
                            onEnter={handleChangeTitle}
                            style={{ paddingLeft: 10, textTransform: 'capitalize', fontWeight: 600 }}
                            value={name ?? ''}
                            onChange={(e: any) => setName(e?.target?.value)}
                            readonly={restricted}
                            placeholder={t('card-title')}
                        />
                    </div>
                    <img src={icon} alt="" style={{ width: 25, height: 25, objectFit: 'cover', objectPosition: 'center' }} />
                </div>
            </span>
            <div className="react-kanban-card__description">
                <EditableCell
                    onEnter={handleChangeDescription}
                    style={{ paddingLeft: 10 }}
                    value={localDescription}
                    onChange={(e: any) => setLocalDescription(e?.target?.value)}
                    readonly={restricted}
                    placeholder={t('card-description')}
                />
            </div>
            {
                showDates ? (
                    <div className="react-kanban-card__dates">
                        <div className="react-kanban-card__date-control-group">
                            <label htmlFor={`start-date-${id}`}>{t('start-date')}</label>
                            <DateSelect
                                defaultText={t('none')}
                                onChange={handleStartDateChange}
                                id={`start-date-${id}`}
                                defaultValue={startsAt ? new Date(startsAt) : null}
                            />
                        </div>
                        <div className="react-kanban-card__date-control-group">
                            <label htmlFor={`due-date-${id}`}>{t('due-date')}</label>
                            <DateSelect
                                defaultText={t('none')}
                                onChange={handleDueDateChange}
                                id={`due-date-${id}`}
                                defaultValue={endsAt ? new Date(endsAt) : null}
                            />
                        </div>
                    </div>
                ) : null
            }
        </div>
    );
};

export default KanbanCard;
