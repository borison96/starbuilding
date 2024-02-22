import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "../../hooks";
import { setColunm } from "../../services/redux/reducers/kanban/kanban.slice";
import { enableRepresentation } from "../../services/redux/reducers/representation/representation.slice";
import { InputButton } from "../controls/button/InputButton.component";
import CirclePlusIcon from "../icons/CirclePlus.icon";
import './kanban.scss';
export interface KanbanColunHeaderProp {
    title?: string;
    color?: string;
    iconName?: string;
    id?: number | string;
    label?: string;
    cards?: Array<any>;
    isProjectBoard?: boolean;
    onAddCard?: (name: string, status: string) => void;
};

const KanbanColumnHeader = ({ color, id, label, cards, isProjectBoard, onAddCard }: KanbanColunHeaderProp) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    useEffect(() => {
        const columnEl = document.body.querySelector(`div[data-rbd-draggable-id="column-draggable-${id}"]`) as HTMLElement;
        if (columnEl) {
            columnEl.style.backgroundColor = `rgba(${color}, 0.5)`;
        }
    }, []);
    const handleAddCard = () => {
        if (isProjectBoard) {
            dispatch(enableRepresentation('map'));
        }
        dispatch(setColunm(label));
    }
    return (
        <div
            id={`kanban-column-header-${id}`}
            className="kanban-colum-header"
            style={{
                marginBottom: 5,
                color: `rgb(${color})`,
                padding: 5,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}
        >
          {`${t(label)} (${cards?.length})`}
          <button style={{ backgroundColor: `rgba(${color}, 0.3)`}} className="kanban-colum-header-btn" type="button">
            <span style={{ backgroundColor: `rgb(${color})` }}/>
            <span style={{ backgroundColor: `rgb(${color})` }}/>
            <span style={{ backgroundColor: `rgb(${color})` }}/>
          </button>
          <div style={{ position: 'absolute', bottom: 5 }}>
            {
                isProjectBoard ? (
                    <button
                        style={{
                            backgroundColor: 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            border: 'none',
                            color: '#fff',
                            outline: 'none',
                            transition: '0.3s'
                        }}
                        className="kanban-add-card-btn"
                        onClick={handleAddCard}
                        title={ isProjectBoard ? t('click-to-use-map-to-select-location', { status: t(label) }) : t('click-to-add-new-card', { status: t(label) })}
                    >
                        <CirclePlusIcon style={{ height: 20, width: 20 }} background={`rgba(${color}, 0.3)`} /> {t('add')}
                    </button>
                ) : (
                    <InputButton
                        style={{
                            backgroundColor: 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            border: 'none',
                            color: '#fff',
                            outline: 'none',
                            transition: '0.3s'
                        }}
                        icon={({ onClick }) => <CirclePlusIcon onClick={onClick} style={{ height: 20, width: 20 }} background={`rgba(${color}, 0.3)`} />}
                        text={t('add')}
                        className="kanban-add-card-btn"
                        title={t('click-to-add-new-card', { status: t(label) })}
                        onEnter={(text) => onAddCard(text, label)}
                    />
                )
            }
          </div>
        </div>
    );
};

export default KanbanColumnHeader;
