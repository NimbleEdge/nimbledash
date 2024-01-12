import React, { useState, useEffect } from 'react';
import './modal.css';

const Modal = ({ isOpen, onClose, children }) => {
    const [isModalOpen, setIsModalOpen] = useState(isOpen);
  
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
            <div className="modal-content">
              <button className="close-button" onClick={closeModal}>
                &times;
              </button>
              {children}
            </div>
          </div>
        )}
      </>
    );
  };

export default Modal;