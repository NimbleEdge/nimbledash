import Table, { TextOnlyComponent } from "presentation/components/Table/table";
import '../../../../common.css';
import '../admin_page.css';
import './modelsTable.css';
import React, { useEffect, useState } from "react";
import { TagsListComponent } from "presentation/components/Tags/tagsList";
import ModelUpload from "../ModelUpload/modelUpload";
import Modal from "presentation/components/modal/modal";

const uploadNewModalComponent = () => {
    return (
        <div className="uploadNewModelFooter">
            <div className={`uploadPlusSign`}>+</div>
            <div>Upload new model</div>
        </div>
    )
}

const ModelsTable = ({modelsDetails, onModelClick, allTagsList}) => {
    const [modelsViewData, updateModelsViewData] = useState({
        headers: [{text: 'Models'}, {text: 'Compatability Tags'}, {text: 'Latest Version'}],
        body: [],
    });
    const [isNewModelModalOpen, setIsNewModelModalOpen] = useState(false);

    const openNewModelModal = () => {
        setIsNewModelModalOpen(true);
    };

    const closeNewModelModal = () => {
        setIsNewModelModalOpen(false);
    };

    const ModelNameColumnComponent = (data) => {

        const [isModelUpdatelModalOpen, setIsModelUpdateModalOpen] = useState(false);

        const openModelUpdateModal = () => {
            setIsModelUpdateModalOpen(true);
        };

        const closeModelUpdateModal = () => {
            setIsModelUpdateModalOpen(false);
        };

        return (
            <div className="modelNameCol">
                {isModelUpdatelModalOpen && 
                    <Modal isOpen={isModelUpdatelModalOpen} onClose={closeModelUpdateModal}>
                        <ModelUpload isNewModel={false} allTagsList={allTagsList} existingModelName={data.text} closeModal={closeModelUpdateModal} />
                    </Modal>
                }
                <button className="updateModelButton" onClick={openModelUpdateModal}>Update</button>
                <div className={`modelName`} onClick={() => data.onClick(data.text)}>{data.text}</div>
            </div>
        )
    }

    const updateModelButton = () => {
        return <button className="uploadNewModelButton">Update</button>
    }

    useEffect(() => {
        modelsViewData.body = [];
        let index = 0;
        for(const modelName in modelsDetails) {
            index++;
            const tagsArray = [];
            for(const tag in modelsDetails[modelName]['tags']) tagsArray.push(tag);
            modelsViewData.body.push([{Component: ModelNameColumnComponent, data: {text: modelName, onClick: onModelClick}}, {Component: TagsListComponent, data: {tags: tagsArray}}, {Component: TextOnlyComponent, data: {text: modelsDetails[modelName].latestVersion}}]);
        }
        updateModelsViewData({...modelsViewData});
    }, [modelsDetails])
    
    return (
        <div className={`modelsTableView flexColumn overflowAuto`}>
            <button onClick={openNewModelModal} className="uploadNewModelButton">+ Upload new modal</button>
            {isNewModelModalOpen && 
                <Modal isOpen={isNewModelModalOpen} onClose={closeNewModelModal}>
                    <ModelUpload isNewModel={true} allTagsList={allTagsList} closeModal={closeNewModelModal} />
                </Modal>
            }
            <Table data={modelsViewData}/>
        </div>
    )
}

export default ModelsTable;