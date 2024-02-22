import { CSSProperties, ElementType, Fragment, ReactNode, useEffect, useRef } from "react";
import { useDrop } from "react-dnd";
import { DragKnowledgeNodeItemType } from "../../drag-n-drop";
import { TABLE_ROW } from "../../drag-n-drop/item-types.dnd";

export type DragRowTargePropType = {
    children: ReactNode | ReactNode[];
    target?: number | string;
    element?: ElementType;
    onDrop?: (item?: DragKnowledgeNodeItemType, target?: number | string) => void;
    onHover?: (item?: DragKnowledgeNodeItemType, target?: number | string) => void;
    style?: CSSProperties;
}
export const DropRawTarget = ({ target, children, onDrop, onHover, style, element: ElementType = 'div' }: DragRowTargePropType) => {
    const handleDrop = () => {
        if (onDrop) {
            onDrop(itemRef.current, target);
        }
    };
    const itemRef = useRef<DragKnowledgeNodeItemType>();
    const [{ isOver, item }, drop] = useDrop(
        () => ({
          accept: TABLE_ROW,
          drop: handleDrop,
          collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            item: monitor.getItem<DragKnowledgeNodeItemType>(),
          })
        }),
        []);
    useEffect(() => {
        if (typeof onHover === 'function') {
            if (isOver) {
                onHover(item, target);
            } else {
                onHover();
            }
        }
    }, [isOver]);
    useEffect(() => {
        itemRef.current = item;
    }, [item]);
    return (
        <ElementType
            ref={drop}
            className={`${isOver ? 'data-table-xx-hover-effect' : 'data-table-xx-hover-effect-reset'}`}
            style={style}
         >
            { children }
        </ElementType>
    )
}