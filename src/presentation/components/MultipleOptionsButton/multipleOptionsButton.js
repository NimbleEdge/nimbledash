import React, { useState } from "react";
import PropTypes from 'prop-types';
import './multipleOptionsButton.css';

const MultipleOptionsButton = ({options, handleSelection, selectedOption}) => {
    const [selected, updateSelected] = useState(selectedOption);
    const handleChange = (option) => {
        updateSelected(option);
        handleSelection(option);
    }
    return (
        <div className="toggle-container">
            {
                options.map((option, index) => {
                    return <button className={`toggle-btn ${selected == option ? 'active' : ''} ${index == 0 ? 'leftmost-btn' : ''} ${index == options.length - 1 ? 'rightmost-btn' : ''}`} onClick={() => handleChange(option)}>{option}</button>
                })
            }
        </div>
    )
}

export default MultipleOptionsButton;