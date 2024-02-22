import { useRef, useState } from 'react';
import { dateToInputString } from '../../../utils';
import CheckMarkIcon from '../../icons/CheckMark.icon';
import './date-select.scss';
export interface DateSelectType {
    defaultValue?: Date;
    onChange?: (val?: Date) => void;
    id?: string;
    defaultText?: string;
}
const DateSelect = ({ id, defaultValue, defaultText, onChange }: DateSelectType) => {
    const [hideInput, setHideInput] = useState(true);
    const inputElRef = useRef<HTMLInputElement>();
    const handleFocus = () => {
        let el = inputElRef?.current as HTMLInputElement & { showPicker?: () => void; };
        setHideInput(false);
        setTimeout(() => {
            if (el?.showPicker) {
                el.showPicker();
                el?.focus();
            } else {
                el?.focus();
            }
        }, 100);
    }
    const handleBlur = () => {
        setTimeout(() => setHideInput(true), 300);
    }
    const handleChangeOk = () => {
        const val = inputElRef?.current?.value;
        if (typeof onChange === 'function' && val) {
            const dateChange = new Date(val);
            if (dateChange?.getTime() !== defaultValue?.getTime()) {
                onChange(dateChange);
            }
        }
        setTimeout(() => setHideInput(true), 300);
    }
    return (
        <div tabIndex={0} role="button" onFocus={handleFocus} onClick={handleFocus} className="date-input-container">
            <input
                onFocus={(e) => { e.stopPropagation();}}
                defaultValue={defaultValue ? dateToInputString(defaultValue) : dateToInputString(new Date())}
                onBlur={handleBlur}
                hidden={hideInput}
                ref={inputElRef}
                type="date"
                id={id}
            />
            <button
                onFocus={(e) => e.stopPropagation() }
                onClick={(e) => { e.stopPropagation(); handleChangeOk(); } }
                hidden={hideInput}
                >
                <CheckMarkIcon background="#7B83EB" />
            </button>
            <span hidden={!hideInput}>{ defaultValue ? defaultValue.toLocaleDateString() : defaultText }</span>
        </div>
    );
};

export default DateSelect;
