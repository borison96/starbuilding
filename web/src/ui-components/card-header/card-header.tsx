import React, { ReactNode } from 'react';
import searchBlack from './../../asset/svg/search-black.svg';
import filter from './../../asset/svg/filter.svg'
import chevronLeft from './../../asset/svg/chevron-left.svg';
import './card-header.scss'
import Input from "../input/input";

type CardHeaderProps = {
    title: string
    search: string | ReactNode
}

const CardHeader = ({title, search}: CardHeaderProps) => {
    return (
        <div className={"card-head"}>
            <div className={"card-f-row"}>
                <b>{title}</b>
                <div className={"card-filter"}>
                    <u>Trier et filtrer</u>
                    <img src={filter}/>
                    <img src={searchBlack}/>
                </div>
            </div>
            <div className={"card-search"}>
                <div className={"navigate"}>
                    <div className={"black-round"}><img src={chevronLeft}/></div>
                    <div className={"black-round"}><img src={chevronLeft}/></div>
                </div>
                {
                    typeof search === 'string' ?
                        <Input type={"card-header"} title={search} doThings={() => console.log()} /> :
                        search
                }
            </div>
            <div className={"break"}></div>
        </div>
    );
};

export default CardHeader;
