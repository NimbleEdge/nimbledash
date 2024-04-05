import React, { useState } from "react";
import './actionButtons.css'

const DownloadIcon = ({onClickHandler, customStyle = {}}) => {
    const [isHovered, setIsHovered] = useState(false);
    const style = {width: '16px', height: '20px'}
    const mergedStyle = {...style, customStyle};

    return (
        <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} style={customStyle} className={"downloadAction"} >
            <img src={"/assets/icons/download.svg"} onClick={onClickHandler} style={{width: '16px', height: '20px'}} />
            {<div className="tooltip-text">Download</div>}
        </div>
    )
}

export default DownloadIcon;