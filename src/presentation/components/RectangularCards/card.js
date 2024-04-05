import './cards.css';
import React from "react";

export const RectCard = ({card, customStyle = {}, hasRemoveButton = false, handleRemove = null, selectable = false, selected = false, handleClick = null}) => {
    const defaultStyle = {
        box: {},
        title: {},
        subtitle: {}
    };
    const mergedStyle = {...defaultStyle, ...customStyle};
    const handleClickInternal = () => {
        console.log(card);
        if(selectable) handleClick(card);
    }
    const handleRemoveInternal = () => {
        handleRemove(card);
    }
    return (
        <div key={card.title} className={'card-box' + (selectable && selected ? ' selected-card-box' : '') + (selectable && !selected ? ' un-selected-card-box' : '')} style={mergedStyle.box} onClick={handleClickInternal}>
            {hasRemoveButton && <div className={`close-card`} onClick={handleRemoveInternal}>X</div>}
            <div className={`card-title` + (selected ? ' selected-card-title' : '')} style={mergedStyle.title}>{card.title}</div>
            {card.subtitle && <div className={`card-subtitle` + (selected ? ' selected-card-subtitle' : '')} style={mergedStyle.subtitle}>{card.subtitle}</div>}
        </div>
    )
}