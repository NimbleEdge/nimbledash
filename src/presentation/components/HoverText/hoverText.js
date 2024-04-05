import React, { useState } from "react";
import './hoverText.css'

const HoverText = ({children, onHoverText}) => {
    return (
        <div className="hover-text-container">
            {children}
            <div className="hover-text">{onHoverText}</div>
        </div>
    )
}

export default HoverText;