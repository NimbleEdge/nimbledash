import './rectangularCards.css';
import React, { useEffect, useState } from "react";

const RectCard = ({card, customStyle = {}}) => {
    const defaultStyle = {
        box: {},
        title: {},
        subtitle: {}
    };
    const mergedStyle = {...defaultStyle, ...customStyle};
    return (
        <div key={card.title} className={`card-box`} style={mergedStyle.box}>
            <div className={`card-title`} style={mergedStyle.title}>{card.title}</div>
            {card.subtitle && <div className={`card-subtitle`} style={mergedStyle.subtitle}>{card.subtitle}</div>}
        </div>
    )
}

const ClickableRectCard = ({card, selected, onClick, customStyle = {}}) => {
    const defaultStyle = {
        box: {},
        selectedBox: {},
        title: {},
        selectedTitle: {},
        subtitle: {},
        selectedSubtitle: {},
    };
    const mergedStyle = {...defaultStyle, ...customStyle};
    return (
        <>
            {
                selected &&
                <div key={card.title} style={mergedStyle.selectedBox} className={`card-box clickable selected-card-box`} onClick={(e) => onClick(card)}>
                    <div style={mergedStyle.selectedTitle} className={`card-title selected-card-title`}>{card.title}</div>
                    {card.subtitle && <div style={mergedStyle.selectedSubtitle} className={`card-subtitle selected-card-subtitle`}>{card.subtitle}</div>}
                </div>
            }
            {
                !selected &&
                <div key={card.title} style={mergedStyle.box} className={`card-box clickable not-selected-card-box`} onClick={(e) => onClick(card)}>
                    <div style={mergedStyle.title} className={`card-title not-selected-card-title`}>{card.title}</div>
                    {card.subtitle && <div style={mergedStyle.subtitle} className={`card-subtitle not-selected-card-subtitle`}>{card.subtitle}</div>}
                </div>
            }
        </>
        
    )
}

export const CardsList = ({cards, customStyle = {}}) => {
    return (
        <div className="cards-list">
            {cards.map((card) => (
                <RectCard card={card} customStyle={customStyle}/>
            ))}
        </div>
    )
}

export const SelectableCardsList = ({cards, selectedCards, handleCardClick}) => {
    return (
        <div className="cards-list">
            {cards.map((card) => (
                <ClickableRectCard card={card} selected={selectedCards.includes(card.title)} onClick={(e)=> handleCardClick(card.title)}/>
            ))}
        </div>
    )
}