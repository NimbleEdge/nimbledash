import React, { useState } from "react";
import './hoverTooltip.css'

const HoverTooltip = ({children, text}) => {
    const [isHovered, setIsHovered] = useState(false);
    console.log(children);
    return (
        <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className="tooltip">
            {children}
            {isHovered && <div className="tooltiptext">{text}</div>}
        </div>
    )
}

export default HoverTooltip;