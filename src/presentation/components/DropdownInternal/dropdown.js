import React, { useState } from 'react';
import './dropdown.css'

const Dropdown = ({ options, handleSelection, defaultSelectedOption}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(defaultSelectedOption);

  const toggling = () => setIsOpen(!isOpen);

  const onOptionClicked = value => () => {
    setSelectedOption(value);
    handleSelection(value);
    setIsOpen(false);
  };

  return (
    <div className="dropdown-container">
      <div className="dropdown-header" onClick={toggling}>
        <div className='header-text'>{selectedOption}</div>
        <img src={"/assets/icons/dropdownArrow.svg"} className={`arrow ${isOpen ? 'open' : 'close'}`}/>
      </div>
      {isOpen && (
        <div className="dropdown-list">
          {options.map(option => (
            <div className="dropdown-list-item" key={option} onClick={onOptionClicked(option)}>
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
