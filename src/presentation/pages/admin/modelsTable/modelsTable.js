import Table, { TextOnlyComponent } from "presentation/components/Table/table";
import '../../../../common.css';
import '../admin_page.css';
import './modelsTable.css';
import React, { useEffect, useState } from "react";
import { TagsListComponent } from "presentation/components/Tags/tagsList";
import ModelUpload from "../ModelUpload/modelUpload";
import Modal from "presentation/components/modal/modal";
import { downloadModel } from "./modelDownload";
import DownloadIcon from "presentation/components/actionButtons/downloadIcon";

const ModelsTable = ({modelsDetails, onModelClick, allTagsList, updateModelsList, isUploadNewModelModalOpen, setIsUploadNewModelModalOpen}) => {
    const [modelsViewData, updateModelsViewData] = useState({
        headers: [
            {text: 'Models'}, 
            {text: 'Latest Version'}, 
            {text: 'Compatability Tags [ Latest Version ]'}, 
            {text: 'Actions'}
        ],
        body: [],
    });
    //const [isNewModelModalOpen, setIsNewModelModalOpen] = useState(false);

    const openNewModelModal = () => {
        setIsUploadNewModelModalOpen(true);
    };

    const closeNewModelModal = () => {
        setIsUploadNewModelModalOpen(false);
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
                <img className={"download-model-icon"} src={"/assets/icons/download.svg"} onClick={() => downloadModel({modelName: modelName, modelVersion: modelVersion})}></img>
                <img className={"update-model-icon"} src={"/assets/icons/update.svg"} onClick={openModelUpdateModal}></img>
            </div>
        )
    }

    const ModelNameColumnComponent = ({text, onClick}) => {

        return (
            <div className="modelNameCol" onClick={() => onClick(text)}>
                <div className={`modelName`}>{text}</div>
            </div>
        )
    }

    useEffect(() => {
        modelsViewData.body = [];
        for(const modelName in modelsDetails) {
            const tagsArray = [];
            for(const tag in modelsDetails[modelName]['tags']) tagsArray.push(tag);
            modelsViewData.body.push([
                {Component: ModelNameColumnComponent, data: {text: modelName, onClick: onModelClick}}, 
                {Component: TextOnlyComponent, data: {text: modelsDetails[modelName].latestVersion}}, 
                {Component: TagsListComponent, data: {tags: tagsArray}},
                {Component: ActionColComponent, data: {modelName: modelName, modelVersion: modelsDetails[modelName].latestVersion}}
            ]);
        }
        updateModelsViewData({...modelsViewData});
    }, [modelsDetails])

    return (
        <div className={`modelsTableView flexColumn overflowAuto`}>
            {/* <button onClick={openNewModelModal} className="uploadNewModelButton">+ Upload new model</button> */}
            {isUploadNewModelModalOpen && 
                <Modal isOpen={isUploadNewModelModalOpen} onClose={closeNewModelModal}>
                    <ModelUpload isNewModel={true} allTagsList={allTagsList} updateModelsList={updateModelsList} closeModal={closeNewModelModal} />
                </Modal>
            }
            <Table data={modelsViewData}/>
        </div>
    )
}

export default ModelsTable;