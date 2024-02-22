import React from 'react';
import './custom-button.scss'
import {useSelector} from "react-redux";
import {RootState} from "../../services/redux/store";

type CustomButtonProps = {
    title: string
    icon: string
    doThings?: Function
    dark?: boolean
}
const CustomButton = ({title, icon, doThings, dark}: CustomButtonProps) => {
    const tab = useSelector<RootState, string>((state) => state.pages.selected_tab);
    return (
        <span className={`custom-button ${tab === title ? "selected" : ""} ${dark ? "dark" : "light"}`} onClick={() => {
            doThings && doThings()
        }}>
            <img src={icon} alt={""}/>
            <span>{title}</span>
        </span>
    );
};

export default CustomButton;
