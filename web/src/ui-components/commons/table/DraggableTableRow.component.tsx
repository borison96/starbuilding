import { ReactNode, HTMLProps, CSSProperties, useEffect, useRef, useState } from "react";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { DragKnowledgeNodeItemType } from "../../drag-n-drop";
import { TABLE_ROW } from "../../drag-n-drop/item-types.dnd";
import DragHandle from "./drag-handle/DragHandle.component";
export type DraggableRowPropType = {
    children: ReactNode | ReactNode[];
    dragItem?: DragKnowledgeNodeItemType,
} & Partial<HTMLProps<HTMLTableRowElement>>;
function getStyles(left: number, top: number, isDragging: boolean): CSSProperties {
    const transform = `translate3d(${left}px, ${top}px, 0)`;
    return isDragging ? {
      position: 'absolute',
      transform,
      WebkitTransform: transform,
      opacity: 0,
      height: 0,
    } : {};
}
const DraggableTableRow = ({ children, dragItem, style, ...props }: DraggableRowPropType) => {
    const dragHandleRef = useRef();
    const [left] = useState(0);
    const [top] = useState(0); 
    const [{ isDragging }, setDragRef, preview] = useDrag(() => ({
        type: TABLE_ROW,
        item: dragItem,
        collect: (monitor) => ({
          isDragging: !!monitor.isDragging()
        })
      }));
      useEffect(() => {
        preview(getEmptyImage(), { captureDraggingState: false });
      }, []);
    return (
        <tr 
            style={{
                ...(style ?? {}),
                ...getStyles(left, top, isDragging),
            }}
            {...props}
            ref={setDragRef}
        >
            <DragHandle ref={dragHandleRef} />
            {children}
        </tr>
    );
}
export default DraggableTableRow;
