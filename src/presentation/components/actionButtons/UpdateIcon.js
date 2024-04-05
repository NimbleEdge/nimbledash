import React from "react";

const UpdateIcon = ({onClickHandler, customStyle = {}}) => {
    const style = {width: '16px', height: '20px'}
    const mergedStyle = {...style, customStyle};
    return (
        <img className={"download-model-icon"} src={"/assets/icons/download.svg"} onClick={onClickHandler} style={mergedStyle}/>
    )
}

export default UpdateIcon;