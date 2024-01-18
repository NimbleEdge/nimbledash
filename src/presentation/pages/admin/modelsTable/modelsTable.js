import Table, { TextOnlyComponent } from "presentation/components/Table/table";
import '../../../../common.css';
import '../admin_page.css';
import './modelsTable.css';
import React, { useEffect, useState } from "react";
import { TagsListComponent } from "presentation/components/Tags/tagsList";
import ModelUpload from "../ModelUpload/modelUpload";
import Modal from "presentation/components/modal/modal";
import { downloadModel } from "./modelDownload";

const ModelsTable = ({modelsDetails, onModelClick, allTagsList, updateModelsList}) => {
    const [modelsViewData, updateModelsViewData] = useState({
        headers: [{text: 'Models'}, {text: 'Latest Version'}, {text: 'Actions'}, {text: 'Compatability Tags'}],
        body: [],
    });
    const [isNewModelModalOpen, setIsNewModelModalOpen] = useState(false);

    const openNewModelModal = () => {
        setIsNewModelModalOpen(true);
    };

    const closeNewModelModal = () => {
        setIsNewModelModalOpen(false);
    };

    const ActionColComponent = ({modelName, modelVersion}) => {
        const [isModelUpdatelModalOpen, setIsModelUpdateModalOpen] = useState(false);
        const openModelUpdateModal = () => {
            setIsModelUpdateModalOpen(true);
        };

        const closeModelUpdateModal = () => {
            setIsModelUpdateModalOpen(false);
        };
        return (
            <div className="actionColCell">
                {isModelUpdatelModalOpen && 
                    <Modal isOpen={isModelUpdatelModalOpen} onClose={closeModelUpdateModal}>
                        <ModelUpload isNewModel={false} allTagsList={allTagsList} existingModelName={modelName} updateModelsList={updateModelsList} closeModal={closeModelUpdateModal} />
                    </Modal>
                }
                <button className="update-model-btn" onClick={openModelUpdateModal}>Update</button>
                <button className="download-model-btn" onClick={() => downloadModel({modelName: modelName, modelVersion: modelVersion})}>Download</button>
            </div>
        )
    }

    const ModelNameColumnComponent = ({text, onClick}) => {

        return (
            <div className="modelNameCol">
                <div className={`modelName`} onClick={() => onClick(text)}>{text}</div>
            </div>
        )
    }

    useEffect(() => {
        modelsViewData.body = [];
        for(const modelName in modelsDetails) {
            const tagsArray = [];
            for(const tag in modelsDetails[modelName]['tags']) tagsArray.push(tag);
            modelsViewData.body.push([{Component: ModelNameColumnComponent, data: {text: modelName, onClick: onModelClick}}, {Component: TextOnlyComponent, data: {text: modelsDetails[modelName].latestVersion}}, {Component: ActionColComponent, data: {modelName: modelName, modelVersion: modelsDetails[modelName].latestVersion}}, {Component: TagsListComponent, data: {tags: tagsArray}}]);
        }
        updateModelsViewData({...modelsViewData});
    }, [modelsDetails])

    return (
        <div className={`modelsTableView flexColumn overflowAuto`}>
            <button onClick={openNewModelModal} className="uploadNewModelButton">+ Upload new model</button>
            {isNewModelModalOpen && 
                <Modal isOpen={isNewModelModalOpen} onClose={closeNewModelModal}>
                    <ModelUpload isNewModel={true} allTagsList={allTagsList} updateModelsList={updateModelsList} closeModal={closeNewModelModal} />
                </Modal>
            }
            <Table data={modelsViewData}/>
        </div>
    )
}

export default ModelsTable;