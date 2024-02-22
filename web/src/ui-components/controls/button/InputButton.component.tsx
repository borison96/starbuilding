import { ChangeEvent, CSSProperties, FocusEvent, KeyboardEvent, MouseEvent, useRef, useState } from "react";
import './button.scss';
export type ClickHanlder = (e?: MouseEvent<HTMLButtonElement>) => void;
export type InputButtonPropType = {
    icon?: JSX.Element | ((props?: { onClick?: ClickHanlder}) => JSX.Element);
    onChange?: (e?: ChangeEvent<HTMLInputElement>) => void;
    onEnter?: (val: string) => void;
    value?: string;
    text?: string;
    color?: string;
    background?: string;
    style?: CSSProperties;
    className?: string;
    title?: string;
    onClick?: ClickHanlder;
};
export const InputButton = ({ icon, onChange, onEnter, value, text, color, style, background, className, onClick, title }: InputButtonPropType) => {
    const [clicked, setClicked] = useState(false);
    const dataVal = useRef('');
    const handleEnter = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e?.key && e?.key?.toLowerCase() === 'enter') {
            if (onEnter) {
                onEnter((e?.target as HTMLInputElement).value);
            }
            setClicked(false);
            dataVal.current = '';
        } else if (e?.key && e?.key?.toLowerCase() === 'tab') {
            if (onEnter) {
                onEnter((e?.target as HTMLInputElement).value);
            }
            setClicked(false);
            dataVal.current = '';
        }
    }
    const handleBlur = (e: FocusEvent) => {
        dataVal.current = (e?.target as HTMLInputElement).value;
        setClicked(false);
    }
    return (
        <div title={title} style={{ ...(style ?? {}), color, background }} className={`input-button-container ${className ?? ''}`}>
            {
                clicked ? (
                    <input
                        className="input-button-container__input"
                        placeholder={text}
                        autoFocus
                        onBlur={handleBlur}
                        onKeyDown={handleEnter}
                        {...( value ? { value } : {})}
                        {...( onChange ? { onChange } : {})}
                        defaultValue={dataVal.current}
                    />
                ) : (
                    <>
                        <button onClick={onClick} className="input-button-container__btn" onFocus={() => setClicked(true)}>
                            {
                                typeof icon === 'function' ? icon({ onClick: (e) => { e?.stopPropagation(); setClicked(true); }}) : icon
                            }
                            { text }
                        </button>
                    </>
                )
            }
        </div>
    )
};
