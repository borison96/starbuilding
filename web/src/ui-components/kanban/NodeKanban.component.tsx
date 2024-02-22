import Board from '@asseinfo/react-kanban';
import '@asseinfo/react-kanban/dist/styles.css';
import './kanban.scss';
import { useTranslation } from "react-i18next";
import { useEffect, useState } from 'react';
import { getStatus } from '../../utils';
import KanbanColumnHeader from './KanbanColumnHeader.comonent';
import KanbanCard from './KanbanCard.component';
export interface LabelType { id?: string | number; label?: string; title?: string; };
export interface KanbanType {
    columns: Array<LabelType>;
    data: Array<any>;
};
type CellUpdateProp = { id: string; node: Record<string, string>; };
export interface KanbanProps {
    kanban: KanbanType;
    onUpdateNode?: (props: CellUpdateProp) => void;
    onUpdateCell?: (props: CellUpdateProp) => void;
    onAddNewNode?: (props: CellUpdateProp) => void;
    onAddNewColumn?: (name: string) => void;
    onNewRowClick?: (e: any) => void;
    selectedProjectId?: any;
    nodeId?: string;
    [key: string]: any;
};
export const sortColumns = (a: any, b: any) => {
    const sortOrder = {
        todo: 1,
        'in-progress': 2,
        done: 3,
        delivered: 4,
    }
    const aLabel = a.label as keyof typeof sortOrder;
    const bLabel = b.label as keyof typeof sortOrder;
    if (sortOrder[aLabel] > sortOrder[bLabel]) return 1;
    if (sortOrder[aLabel] < sortOrder[bLabel]) return -1;
    return 0;
}
export const parseKanban = (kanban: KanbanType, nodeId: string) => {
    let data: { columns: Array<{ cards: Array<any>; [key: string]: any;}>;} = { columns: [] };
    if (kanban?.columns?.length > 0) {
        kanban?.columns?.forEach((col) => {
            let color = getStatus(col.label, { rgb: true }).color;
            let filterFunc = (f: any) => (f?.attributes?.status?.toString() === col?.label);
            if (col.label == 'todo') {
                filterFunc = (f: any) => (
                    f?.attributes?.status?.toString() === col?.label ||
                    (!f?.attributes?.status && f?.attributes?.nodeType !== 'empty')
                );
            }
           let cards = kanban?.data?.filter(filterFunc)?.map(
                (c: any) => {
                    const attr = c?.attributes;
                    return attr ? {...attr, title: c?.name , parentId: c?.tree ? c?.id : nodeId, color } : {};
                }
            );
            data?.columns?.push({
                ...col,
                id: col.label,
                color,
                title: col.label,
                cards
            });
        });
    }
    data.columns?.sort(sortColumns);
    return data;
}
const NodeKanban = ({ kanban, onUpdateCell, selectedProjectId, nodeId } : KanbanProps) => {
    const [board, setBoard] = useState<any>({ columns: [] });
    console.log({ kanban });
    useEffect(() => {
        //console.log({ board: parseKanban(kanban, t, nodeId)});
        const otherBoard = parseKanban(kanban, nodeId);
        setBoard(otherBoard);
        console.log({ otherBoard });
    }, [kanban.data]);
    const handleColumnDragEnd = (...prop: any) => {
        const { fromPosition } = prop[1];
        const { toPosition } = prop[2];
        const nBoard = {...board};
        nBoard.columns[fromPosition] = nBoard.columns[toPosition];
        nBoard.columns[toPosition] = prop[0];
        setBoard(nBoard);
    }
    const handleCardDragEnd = (...prop: any) => {
        const { fromPosition, fromColumnId } = prop[1];
        const { toPosition, toColumnId } = prop[2];
        const nBoard = {...board};
        const fColumn = nBoard.columns?.find((f: any) => f.id == fromColumnId);
        fColumn?.cards?.splice(fromPosition, 1);
        const tColumn = nBoard.columns?.find((f: any) => f.id == toColumnId);
        if (fromColumnId !== toColumnId) {
            if (onUpdateCell) {
                if (nodeId) {
                    onUpdateCell({ id: selectedProjectId, node: { parentNodeId: prop[0]?.parentId, id: prop[0]?.id, status: tColumn?.label }});
                } else {
                    onUpdateCell({ id: prop[0]?.parentId, node: { id: prop[0]?.id, status: tColumn?.label }});
                }
            }
        }
        tColumn?.cards?.splice(toPosition, 0, prop[0]);
        // update board
        setBoard(nBoard);
    }
    const handleCardChange = (props: any) => {
        if (onUpdateCell) {
            if (nodeId) {
                onUpdateCell({ id: selectedProjectId, node: { ...props, parentNodeId: props?.parentId }});
            } else {
                onUpdateCell({ id: props?.parentId, node: { ...props, id: props?.id }});
            }
        }
    }
    const renderColumnHeader= ({ title, color, iconName, id, label, cards }: any) => {
        return <KanbanColumnHeader title={title} color={color} id={id} iconName={iconName} label={label} cards={cards}/>;
    }
    const renderCard=({ content, ...props }: any, { removeCard, dragging }: any) => {
        return <KanbanCard onChange={handleCardChange} content={content} dragging={dragging} removeCard={removeCard} {...props} />
    }
      
    return board ? (
        <Board
            renderColumnHeader={renderColumnHeader}
            onColumnDragEnd={handleColumnDragEnd}
            onCardDragEnd={handleCardDragEnd}
            renderCard={renderCard}
        >
            {board}
        </Board>
    ): null;
};

export default NodeKanban;