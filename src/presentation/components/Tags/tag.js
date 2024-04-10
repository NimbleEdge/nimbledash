import React from "react";
import PropTypes from 'prop-types';
import './tags.css';

export const TagComponent = ({text, color, customStyle = {}}) => {
    const bgColor = color || 'white';
    customStyle = {backgroundColor: bgColor, ...customStyle};
    return (
        <div className={`textTag`} style={customStyle}>
            <p style={{fontWeight:"500", margin:"0 auto"}}>{text}</p>
        </div>
    );
}

TagComponent.propTypes = {
    color: PropTypes.string,
    text: PropTypes.string.isRequired,
};