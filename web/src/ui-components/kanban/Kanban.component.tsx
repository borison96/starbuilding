import Board from '@asseinfo/react-kanban';
import '@asseinfo/react-kanban/dist/styles.css';
import './kanban.scss';
import { useEffect, useRef, useState } from 'react';
import { getStatus } from '../../utils';
import KanbanColumnHeader from './KanbanColumnHeader.comonent';
import KanbanCard from './KanbanCard.component';
import ErrorBoundary from '../../errors/ErrorBoundary.component';

export interface LabelType { id?: string | number; label?: string; title?: string; };
export interface KanbanType {
    columns: Array<LabelType>;
    data: Array<any>;
};
type CellUpdateProp = { id: string; node: Record<string, string | Record<string, string>>; };
export interface KanbanProps {
    kanban: KanbanType;
    onUpdateNode?: (props: CellUpdateProp) => void;
    onUpdateCell?: (props: CellUpdateProp) => void;
    onAddNewNode?: (props: CellUpdateProp) => void;
    onAddNewColumn?: (name: string) => void;
    onNewRowClick?: (e: any) => void;
    selectedProjectId?: any;
    nodeId?: string;
    scrollId?: string;
    projectId?: string | number;
    showDates?: boolean;
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
export const parseKanban = (kanban: KanbanType, nodeId?: string, projectId?: string | number) => {
    let data: { columns: Array<{ cards: Array<any>; [key: string]: any;}>;} = { columns: [] };
    if (kanban?.columns?.length > 0) {
        kanban?.columns?.forEach((col) => {
            let color = getStatus(col.label, { rgb: true }).color;
            let filterFunc = (f: any) => {
                if (nodeId) {
                    return f?.attributes?.status?.toString() === col?.label;
                }
                return f?.tree ? f?.tree?.attributes?.status?.toString() === col?.label : f?.attributes?.status?.toString() === col?.label;
            };
            if (col.label == 'todo') {
                filterFunc = (f: any) => {
                    if (nodeId) {
                        return (
                            f?.attributes?.status?.toString() === col?.label || (!f?.attributes?.status && f?.attributes?.nodeType !== 'empty')
                        );
                    }
                    return (
                        f?.tree ?
                        f?.tree?.attributes?.status?.toString() === col?.label || (!f?.tree?.attributes?.status && f?.tree?.attributes?.nodeType !== 'empty') :
                        f?.attributes?.status?.toString() === col?.label || (!f?.attributes?.status && f?.attributes?.nodeType !== 'empty'));
                    
                }
            }
           let cards = kanban?.data?.filter(filterFunc)?.map(
                (c: any, idx) => {
                    const attr = c?.attributes ? c?.attributes : c?.tree?.attributes;
                    return {...(attr ?? { id: idx + 'restricted', restricted: true, description: c?.description }), title: c?.tree ? c?.tree?.name : c?.name , parentId: c?.tree ? c?.id : (nodeId ?? projectId), color };
                }
            );
            data?.columns?.push({
                ...col,
                id: `${col.label}${projectId ?? ''}`,
                color,
                title: col.label,
                cards,
                isProjectBoard: !nodeId
            });
        });
    }
    data.columns?.sort(sortColumns);
    return data;
}
const Kanban = ({ kanban, onUpdateCell, selectedProjectId, nodeId, scrollId, projectId, showDates, onAddNewNode } : KanbanProps) => {
    const [board, setBoard] = useState<any>({ columns: [] });
    const ref = useRef<any>();
    useEffect(() => {
        setBoard(parseKanban(kanban, nodeId, projectId));
    }, [kanban.data]);
    useEffect(() => {
        // scroll to column
        const container = document.getElementById('representation-container-10x');
        if (container) {
            const el = container.firstChild;
            if (el) {
                const scrollTarget = document.getElementById(`kanban-card-${scrollId}`);
                if (scrollTarget) {
                    const dim = scrollTarget.getBoundingClientRect();
                    (el as HTMLDivElement)?.scrollTo({
                        top: dim.y,
                        left: dim.x,
                        behavior: 'smooth',
                    });
                }
            }
        }
    }, [board]);
    const handleColumnDragEnd = (...prop: any) => {
        const { fromPosition } = prop[1];
        const { toPosition } = prop[2];
        const nBoard = {...board};
        nBoard.columns[fromPosition] = nBoard.columns[toPosition];
        nBoard.columns[toPosition] = prop[0];
        setBoard(nBoard);
    }
    const handleCardDragEnd = (...prop: any) => {
        if (!prop[0]?.restricted) {
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
    const handleAddNewNode = (name: string, status: string) => {
        if (onAddNewNode) {
            onAddNewNode({ id: projectId?.toString(), node: { name, attributes: { status }, parentNodeId: nodeId }})
        }
    }
    const renderColumnHeader= ({ title, color, iconName, id, label, cards, isProjectBoard }: any) => {
        return <KanbanColumnHeader onAddCard={handleAddNewNode} isProjectBoard={isProjectBoard} title={title} color={color} id={id} iconName={iconName} label={label} cards={cards}/>;
    }
    const renderCard=({ content, ...props }: any, { removeCard, dragging }: any) => {
        return <KanbanCard showDates={showDates} onChange={handleCardChange} content={content} dragging={dragging} removeCard={removeCard} {...props} />
    }
    function onColumnNew (newColumn: any) {
        const column = { id: new Date().getTime(), ...newColumn };
        return column;
    }
      
    return board?.columns?.length > 0 ? (
        <ErrorBoundary>
            <Board
                renderColumnHeader={renderColumnHeader}
                onColumnDragEnd={handleColumnDragEnd}
                onCardDragEnd={handleCardDragEnd}
                renderCard={renderCard}
                allowAddCard={{ on: 'top' }}
                onColumnNew={onColumnNew}
                id='kanban-board-125'
            >
                {board}
            </Board>
        </ErrorBoundary>
    ): <span />;
};

export default Kanban;
