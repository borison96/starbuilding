import React, { forwardRef, ReactElement } from 'react';
import './input.scss';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleRight, IconDefinition} from "@fortawesome/free-solid-svg-icons";

type InputProps = {
    type?: string
    title?: string
    iconName?: IconDefinition
    doThings?: Function
    hasError?: boolean
    errorMsg?: string
    createForm?: Function
    id?: string;
    [key: string]: any;
    light?: boolean;
    containerClassName?: string;
    icon?: ReactElement<HTMLImageElement | HTMLOrSVGElement>;
    iconPlacement?: 'left' | 'right';
    required?: boolean;
}

const Input = forwardRef(({
    type,
    title,
    iconName,
    doThings,
    hasError,
    errorMsg,
    createForm,
    id,
    light,
    containerClassName,
    icon,
    iconPlacement,
    required,
    ...props
} : InputProps, ref:any) => {
    const returnByInputType = () => {
        const doThingsProp = doThings ? {
            onChange: (e: any) => {
                doThings(e.target.value)
                { createForm && createForm(e)}
            },
        } : {};
        const inputProps = {
            ...props,
            ref,
        };
        switch(type) {
            case 'phone':
                return  <input type={'tel'} id={id} required={required ?? true} {...doThingsProp} {...inputProps} ref={ref}/>
            case 'submit':
            case 'button':
                const btnProp = doThings ? {
                    onClick: () => doThings(),
                } : {};  
                return (
                    <button type={type} className={light?"submit light": "submit"} {...btnProp} {...inputProps}>
                        {title}
                        {iconName ? <div style={{ display: 'flex', justifyContent: 'flex-end', flex: 1 }}><FontAwesomeIcon icon={iconName} className={light?"icon light":"icon"}/></div> : null}
                    </button>
                );
            case 'card-header':
                return <input id={id} type={'text'} required={true} {...inputProps}/>;
            default:
                return <input type={type} id={id} required={required ?? true} {...doThingsProp} {...inputProps}/>;
        }
    }


    return (
        <>
            <div style={{ position: 'relative' }} className={`sign_input-container ${type === 'card-header' ? 'card-h' : ''} ${containerClassName ?? ''}`}>  
                { required && <span className={"required"}>*</span> }
                {returnByInputType()}
                {
                    icon ? (
                        <div
                            style={{...{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                flex: 1,
                                position: 'absolute',
                                zIndex: 99,
                            }, ...(iconPlacement === 'left' ? { left: 0 } : { right: 0 })}}
                        >
                            {icon}
                        </div> 
                    ): null
                }
                { type !== 'submit' && type !== 'button' ? <span>{title}</span> : null}
            </div>
            { hasError && <p className={"errorMsg"}>{errorMsg}</p>}
        </>
    );
});

export default Input;
