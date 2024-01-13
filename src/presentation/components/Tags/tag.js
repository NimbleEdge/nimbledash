import React from "react";
import PropTypes from 'prop-types';
import './tags.css';

export const TagComponent = ({text, color, customStyle = {}}) => {
    const bgColor = color || 'white';
    customStyle = {backgroundColor: bgColor, ...customStyle};
    return (
        <div className={`textTag`} style={customStyle}>{text}</div>
    );
}

TagComponent.propTypes = {
    color: PropTypes.string,
    text: PropTypes.string.isRequired,
};