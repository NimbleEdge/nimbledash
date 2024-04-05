import React, { useRef, useState } from 'react';
import './dropdown.css'

const Dropdown = ({ options, handleSelection, defaultSelectedOption}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(defaultSelectedOption);
  const dropdownRef = useRef(null);

  const toggling = () => setIsOpen(!isOpen);

  const onOptionClicked = value => () => {
    setSelectedOption(value);
    handleSelection(value);
    setIsOpen(false);
  };

  const openDropdown = () => setIsOpen(true);
  const closeDropdown = () => setIsOpen(false);

  const handleMouseLeave = () => {
    if (!dropdownRef.current.contains(document.activeElement)) {
      setIsOpen(false);
    }
  };

  return (
    <div className="dropdown-container" onMouseEnter={openDropdown} onMouseLeave={closeDropdown} ref={dropdownRef}>
      <div className="dropdown-header">
        <div className='header-text'>{selectedOption}</div>
        <img src={"/assets/icons/dropdownArrow.svg"} className={`arrow ${isOpen ? 'open' : 'close'}`}/>
      </div>
      <div className='dropdown-gap'></div>
      {isOpen && (
        <>
          <div className="dropdown-list">
            {options.map(option => (
              <div className="dropdown-list-item" key={option} onClick={onOptionClicked(option)}>
                {option}
              </div>
            ))}
        </div>
        </>
      )}
    </div>
  );
};

export default Dropdown;
