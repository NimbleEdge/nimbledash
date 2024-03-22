import React from "react";
import { useState } from "react";

function ClickableCard(props){
    const [isSelected, setIsSelected] = useState(false);
    var title = props.title;
    var subtitle = props.subtitle;


    return <div onClick={() => {
        setIsSelected(!isSelected);
    }}>
        {isSelected ? (
        <div className="selectableCard clickableItem">
            <img src={"/assets/icons/red_close.svg"} className='selectableCardCloseIcon' />
            <div className="selectableCardContent">
                <p className="selectableCardTitle">{title}</p>
                <p className="selectableCardSubTitle">{subtitle}</p>
            </div>
        </div>
    ) : (
        <div className="selectableCard clickableItem">
            <img src={"/assets/icons/red_close.svg"} className={`selectableCardCloseIcon ${true ? "cardCanBeDeleted" : ""}`} />
            <div className="selectableCardContent cardIsSelected">
                <p className="selectableCardTitle">{title}</p>
                <p className="selectableCardSubTitle">{subtitle}</p>
            </div>
        </div>
    )}
    </div>
}

// const UnselectedCard = (title, subtitle) => {
//     return 
// }

// const SelectedCard = (title, subtitle, renderCloseButton = true) => {
//     return 
// }

export default ClickableCard;