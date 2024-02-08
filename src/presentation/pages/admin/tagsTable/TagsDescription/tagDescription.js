import React, { useState } from 'react';
import './tagDescription.css'; // You can create a CSS file for styling
import Modal from 'presentation/components/modal/modal';
import { CreateOrUpdateTagModal } from '../TagCreationAndUpdation/TagCreationAndUpdation';

const TruncatedDescription = ({ message, maxLength, modelsDetails, updateTagsList, tagDetails, tagName }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
      setIsModalOpen(true);
  };

  const closeModal = () => {
      setIsModalOpen(false);
  };

  return (
    <>
        <div className={`message-content`} onClick={openModal}>
          {message}
        </div>
        {
          isModalOpen && 
          <Modal isOpen={isModalOpen} onClose={closeModal} customStyle={{maxHeight: '90%'}} hasSaveButton={true}>
            {
              ({attemptSave}) => {
                return (
                  <CreateOrUpdateTagModal modelsDetails={modelsDetails} updateTagsList={updateTagsList} onClose={closeModal} updateTag={true} tagDetails={{...tagDetails, 'name': tagName}} attemptSave={attemptSave} />
                );
              }
            }
          </Modal>
        }
    </>
  );
};

export default TruncatedDescription;
