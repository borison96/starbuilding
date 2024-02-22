import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getStatus } from "../../../utils";
import Dropdown from "react-bootstrap/Dropdown";

export interface DropdownCellPropType {
    onChange: (text: string) => void;
    onEnter?: (text: string) => void;
    editable?: boolean;
    selected?: string;
    style?: any;
    className?: string;
    color?: string;
    options?: Array<{ id?: string; label?: string; [key: string]: string; }>;
    disabled?: boolean;
    [key: string]: any;
}
const DropdownSelectCell = ({  onChange, onEnter, style, className, options, selected, color, editable, disabled, ...props }: DropdownCellPropType) => {
    const { t } = useTranslation();
    const selection = options?.find(f => f?.label === selected);
    const [open, setOpen] = useState(false);
    const [val, setVal] = useState('');
    const handleBlur = () => {
       setTimeout(() => setOpen(false), 300);
    }
    const handleClick = (val: string) => {
        onChange(val);
    }
    return (
        <div style={{
            ...{
                width: '100%',
                background: color ?? 'transparent',
                border: 'none',
                outline: 'none',
                margin: 0,
                lineHeight: 'inherit',
                fontFamily: 'inherit',
                fontSize: 'inherit',
                position: 'relative',
            }, ...(
                style ?? {}
            )
        }}
        {...props}
        className={`dropdown-select-cell-sb ${ className ?? '' }`}
        >
            
            <input
                style={{
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    margin: 0,
                    lineHeight: 'inherit',
                    fontFamily: 'inherit',
                    fontSize: 'inherit',
                    position: 'relative',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                }}
                className="dropdown-select-cell-input"
                value={val || t(selection?.label ?? '')}
                onChange={(e: any) => setVal(e?.target?.value)}
                onFocus={() => setOpen(true)}
                readOnly={!editable}
                onBlur={handleBlur}
            />
            <Dropdown.Menu style={{ maxHeight: 100, overflow: 'auto', backgroundColor: "#dfdfdf" }} show={!disabled && open}>
                {
                    options?.length > 0 && (
                        <>
                            {
                                options?.map((opt) => {
                                    const color = getStatus(opt?.label, { rgb: true }).color;
                                    return (
                                        <Dropdown.Item
                                            key={opt?.label + opt?.id} value={opt?.id ?? opt?.label}
                                            style={{ padding: '1px 0', borderLeft:  selection?.label === opt?.label || selection?.id === opt?.id ? `3px solid rgb(${color})` : ''}}
                                        >
                                            <button className="dropdown-select-button" style={{ color: `rgb(${color})`, backgroundColor: `rgba(${color}, 0.4)`, padding: 5 }} onClick={() => handleClick(opt?.label ?? opt?.id)}>{t(opt?.label ?? '')}</button>
                                        </Dropdown.Item>
                                    )
                                })
                            }
                        </>
                    )
                }
            </Dropdown.Menu> 
        </div>
    )
}

export default DropdownSelectCell;
