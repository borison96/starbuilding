import { useEffect, useRef, useState } from "react";

export interface EditableCellPropType {
    onEnter?: (text: string) => void;
    onBlur?: (text: string) => void;
    style?: any;
    defaultValue?: string | number;
    className?: string;
    readonly?: boolean;
    round?: boolean;
    [key: string]: any;
}
const EditableCell = ({  onEnter, style, className, onBlur, defaultValue, readonly, round, ...props }: EditableCellPropType) => {
    const [value, setValue] = useState('');
    const handleBlur = (e: any) => {
        const val = e?.target?.value;
        console.log('blurring', { val });
        if (onBlur && val?.toString() !== defaultValue?.toString()) {
            onBlur(e?.target?.value);
        }
    }
    const handleEnter = (e: any) => {
        const val = e?.target?.value;
        if (onEnter) {
            if (e?.key && e?.key?.toLowerCase() === 'enter') {
                if (val?.toString() !== defaultValue?.toString()) {
                    onEnter(val);
                }
            } else if (e?.key && e?.key?.toLowerCase() === 'tab') {
                if (val?.toString()?.trim() !== defaultValue?.toString()) {
                    onEnter(val);
                }
            }
        }     
    }
    useEffect(() => {
        setValue(defaultValue?.toString());
    }, [defaultValue]);
    return (
        <input style={{
            ...{
                width: '100%',
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid transparent',
                outline: 'none',
                margin: 0,
                lineHeight: 'inherit',
                fontFamily: 'inherit',
                fontSize: 'inherit',
                borderRadius: round ? 50 : 0,
            }, ...(
                style ?? {}
            )
        }}
        onKeyDown={handleEnter}
        onBlur={handleBlur}
        readOnly={readonly}
        value={value ?? ''}
        onChange={(e) => setValue(e.target.value)}
        {...props}
        className={`editable-cell-sb ${ className ?? '' }`}
        />
    )
}

export default EditableCell;
