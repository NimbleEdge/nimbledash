import React, { useState } from "react";
import PropTypes from 'prop-types';
import './toggleButton.css';

const ToggleButton = ({option1, option2, handleToggle, selectedOption}) => {
    const [selected, updateSelected] = useState(selectedOption);
    const toggle = () => {
        if(selected == option1) {
            updateSelected(option2);
            handleToggle(option2);
        } else {
            updateSelected(option1);
            handleToggle(option1);
        } 
    }
    return (
        <div className="toggle-container">
            <button className={`toggle-btn toggle-btn-left ${selected == option1 ? 'active' : ''}`} onClick={toggle}>{option1}</button>
            <button className={`toggle-btn toggle-btn-right ${selected == option2 ? 'active' : ''}`} onClick={toggle}>{option2}</button>
        </div>
    )
}

ToggleButton.propTypes = {
    option1: PropTypes.string.isRequired,
    option2: PropTypes.string.isRequired,
    handleToggle: PropTypes.func.isRequired
}

export default ToggleButton;