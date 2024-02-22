import { forwardRef } from 'react';
import './drag-handle.scss';

const DragHandle = forwardRef<HTMLTableCellElement>((props, ref) => {
    return (
        <td ref={ref} role="representation" className="drag-handle-xx">
            <div className="drag-handle-bars">
                <div />
                <div />
                <div />
            </div>
            <div className="drag-handle-bars">
                <div />
                <div />
                <div />
            </div>
        </td>
    );
});
export default DragHandle;
