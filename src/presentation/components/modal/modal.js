import React, { useState, useEffect } from 'react';
import './modal.css';

const Modal = ({ isOpen, onClose, children, customStyle = {}, closeButtonDisabled = false, hasSaveButton = false, seriesInfo = {
  isSeries: false,
  hasNext: false,
  hasPrev: false,
  onNext: () => { },
  onPrev: () => { },
  onDone: () => { }
} }) => {
  const [isModalOpen, setIsModalOpen] = useState(isOpen);
  const [clickCount, setClickCount] = useState(0);
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(false);

  const handleSave = () => {
    setClickCount(num => num + 1);
    setIsSaveButtonDisabled(true);
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100%';
    }
    setIsModalOpen(isOpen);
  }, [isOpen]);

  const closeModal = () => {
    document.body.style.overflow = 'auto';
    document.body.style.height = 'auto';
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
            {seriesInfo.isSeries &&
              <div className={`modal-next-icon`} onClick={() => {
                if (seriesInfo.hasNext) {
                  seriesInfo.onNext();
                }
                else{
                  seriesInfo.onDone();
                }
              }}>
                <img className={"saveTick"} src={seriesInfo.hasNext ? "/assets/icons/next.svg" : "/assets/icons/saveTick.svg"}></img>
              </div>
            }
            {seriesInfo.isSeries &&
              <div className={`modal-prev-icon ${seriesInfo.hasPrev ? "" : "disableButton"}`} onClick={() => {
                if (seriesInfo.hasPrev) {
                  seriesInfo.onPrev();
                }
              }}>
                <img className={"saveTick"} src={"/assets/icons/previous.svg"}></img>
              </div>
            }
            {hasSaveButton && children({ clickCount: clickCount })}
            {!hasSaveButton && children}
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;