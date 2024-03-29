import Table, { TextOnlyComponent } from "presentation/components/Table/table";
import '../../../../common.css';
import '../admin_page.css';
import './modelsTable.css';
import React, { useEffect, useState } from "react";
import { TagsListComponent } from "presentation/components/Tags/tagsList";
import ModelUploadAndUpdate from "../ModelUpload/modelUploadAndUpdate";
import Modal from "presentation/components/modal/modal";
import { downloadModel } from "./modelDownload";
import HoverText from "presentation/components/HoverText/hoverText";

const ModelsTable = ({modelsDetails, onModelClick, allTagsList, updateModelsList, isUploadNewModelModalOpen, setIsUploadNewModelModalOpen}) => {
    const [modelsViewData, updateModelsViewData] = useState({
        headers: [
            {text: 'Models'}, 
            {text: 'Latest Version'}, 
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
                    <Modal isOpen={isModelUpdatelModalOpen} onClose={closeModelUpdateModal} customStyle={{height: '654px'}}>
                        <ModelUploadAndUpdate isNewModel={false} allTagsList={allTagsList} existingModelName={modelName} updateModelsList={updateModelsList} closeModal={closeModelUpdateModal} />
                    </Modal>
                }
                <HoverText onHoverText={"Download"}>
                    <img className={"download-model-icon"} src={"/assets/icons/download.svg"} onClick={() => downloadModel({modelName: modelName, modelVersion: modelVersion})}></img>
                </HoverText>   
                <HoverText onHoverText={"Update"}>
                    <img className={"update-model-icon"} src={"/assets/icons/update.svg"} onClick={openModelUpdateModal}></img>
                </HoverText>             
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
            const latestVersion = modelsDetails[modelName]['latestVersion'];
            const latestVersionTags = modelsDetails[modelName]['versionToTags'][latestVersion];
            for(const tag in latestVersionTags) {
                if(latestVersionTags[tag]) tagsArray.push(tag);
            }
            modelsViewData.body.push([
                {Component: ModelNameColumnComponent, data: {text: modelName, onClick: onModelClick, highlightOnHover: true}}, 
                {Component: TextOnlyComponent, data: {text: modelsDetails[modelName].latestVersion, highlightOnHover: true}}, 
                {Component: ActionColComponent, data: {modelName: modelName, modelVersion: modelsDetails[modelName].latestVersion}}
            ]);
        }
        updateModelsViewData({...modelsViewData});
    }, [modelsDetails])

    return (
        <div className={`modelsTableView flexColumn overflowAuto`}>
            {/* <button onClick={openNewModelModal} className="uploadNewModelButton">+ Upload new model</button> */}
            {isUploadNewModelModalOpen && 
                <Modal isOpen={isUploadNewModelModalOpen} onClose={closeNewModelModal}  customStyle={{height: '654px'}}>
                    <ModelUploadAndUpdate isNewModel={true} allTagsList={allTagsList} updateModelsList={updateModelsList} closeModal={closeNewModelModal} />
                </Modal>
            }
            <Table data={modelsViewData}/>
        </div>
    )
}

export default ModelsTable;