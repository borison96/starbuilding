import { useState } from "react";
import { Dropdown } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { KnowledgeNodeDatum } from "../../../typings";
import './dropdown.scss';
export interface OptionType { id?: string; label?: string; [key: string]: string; };
export interface DropdownPropType {
    onChange: (text: string) => void;
    selected?: string;
    activeNode?: KnowledgeNodeDatum;
    options?: Array<OptionType>;
}
const DropdownComponent = ({  onChange, options, selected, activeNode }: DropdownPropType) => {
    const { t } = useTranslation();
    const selection = options?.find(f => f?.label === selected);
    const handleClick = (val: string) => {
        onChange(val);
    }
    return (
        <div className='dropdown-common-xx'>
        <Dropdown className="dropdown-container" placement="left-start">
            <Dropdown.Toggle className="dropdown-toggle-btn">
                <span>{t(selection?.label ?? '')}</span> 
                <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
                    <span className="proj-back__btn"> 
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5.067 8.137">
                            <path id="Flèche" d="M3.438,2.488,1.2,4.775a.683.683,0,0,1-1,0,.782.782,0,0,1,0-1.055L3.6.2A.581.581,0,0,1,4.033,0h.262A.525.525,0,0,1,4.6.2L7.932,3.795a.782.782,0,0,1,0,1.055.683.683,0,0,1-1,0L4.889,2.639C4.306,2.245,4.053,2.132,3.438,2.488Z" transform="translate(0 8.137) rotate(-90)" fill="#fff" fillRule="evenodd"/>
                        </svg>
                    </span>
                </div>
            </Dropdown.Toggle>
            {
                options?.length > 0 && (
                    <Dropdown.Menu className='dropdown-target-container'>
                        {
                            options?.map((opt) => (
                                <Dropdown.Item
                                    key={opt?.label + opt?.id} value={opt?.id ?? opt?.label}
                                    className={`dropdown-list-item-xx ${selection?.label === opt?.label || selection?.id === opt?.id ? 'selected' : ''}`}
                                >
                                    <button className="dropdown-button-xx" onClick={() => handleClick(opt?.label ?? opt?.id)}>{t(opt?.label ?? '')}</button>
                                </Dropdown.Item>
                            ))
                        }
                    </Dropdown.Menu>
                )
            }
        </Dropdown>
        </div>
    )
}

export default DropdownComponent;
