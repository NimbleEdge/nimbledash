import '../../../../../common.css';
import '../../admin_page.css';
import './CreateNewTagModal.css';
import React, { useState } from "react";
import Modal from "presentation/components/modal/modal";
import { CreateOrUpdateTagModal } from './TagCreationAndUpdation';

const CreateNewTagModal = ({modelsDetails, updateTagsList, isModalOpen = false, setIsModalOpen}) => {
    //const [isModalOpen, setIsModalOpen] = useState(defaultModalState);
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    return (
        <>
            {
                isModalOpen && 
                <Modal isOpen={isModalOpen} onClose={closeModal} customStyle={{overflow: 'auto'}} hasSaveButton={true}>
                    {
                        ({attemptSave}) => {
                            return (
                                <CreateOrUpdateTagModal modelsDetails={modelsDetails} updateTagsList={updateTagsList} onClose={closeModal} attemptSave={attemptSave}/>                            
                            );
                        }
                    }
                </Modal>
            }
        </>
    )
}

export default CreateNewTagModal;