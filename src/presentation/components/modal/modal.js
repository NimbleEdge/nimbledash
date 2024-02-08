import React, { useState, useEffect } from 'react';
import './modal.css';

const Modal = ({ isOpen, onClose, children, customStyle = {}, closeButtonDisabled = false, hasSaveButton = false }) => {
    const [isModalOpen, setIsModalOpen] = useState(isOpen);
    const [attemptSave, setAttemptSave] = useState(0);
    const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(false);

    const handleSave = () => {
      setAttemptSave(num => num + 1);
      setIsSaveButtonDisabled(true);
    }
  
    useEffect(() => {
      setIsModalOpen(isOpen);
    }, [isOpen]);
  
    const closeModal = () => {
      setIsModalOpen(false);
      onClose && onClose();
    };
  
    const handleOverlayClick = (e) => {
      if (e.target === e.currentTarget) {
        closeModal();
      }
    };
  
    return (
      <>
        {isModalOpen && (
          <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content" style={customStyle}>
              {!closeButtonDisabled && <button className="close-button" onClick={closeModal}>&times;</button>}
              {hasSaveButton &&  
                <div className={"modal-save-icon"} onClick={handleSave}>
                  <img className={"saveTick"} src={"/assets/icons/saveTick.svg"}></img>
                </div>
              }
              {hasSaveButton && children({attemptSave: attemptSave})}
              {!hasSaveButton && children}
            </div>
          </div>
        )}
      </>
    );
  };

export default Modal;