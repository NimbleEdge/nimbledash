import '../../../../../common.css';
import '../../admin_page.css';
import './TagCreationAndUpdation.css';
import React, { useEffect, useState } from "react";
import { createDeploymentTag, updateDeploymentTag } from "data/apis";
import { toast } from "react-toastify";
import Search from 'presentation/components/Search/searchComponent';
import DisplayCards from './DisplayCards';
import ModelVersionSelection from './ModelVersionSelection';

const getPreAttachedModels = (tagDetails) => {
    const preAttachedModels = {};
    if(tagDetails.hasOwnProperty('models')) {
        for(const model in tagDetails['models']) {
            const versions = {}
            for(const version of tagDetails['models'][model]) {
                versions[version] = {'preAttached': true}
            }
            if(tagDetails['models'][model].length != 0) {
                preAttachedModels[model] = versions;
            }
        }
    }
    return preAttachedModels;
}

const changeSelectedModelsDataStructure = (selectedModels) => {
    const selectedModelsModifiedStruct = {};
    for(const model in selectedModels) {
        const versionsArray = [];
        for(const version in selectedModels[model]) {
            versionsArray.push(version);
        }
        if(versionsArray.length > 0) {
            selectedModelsModifiedStruct[model] = versionsArray;
        }
    }
    return selectedModelsModifiedStruct;
}

export const CreateOrUpdateTagModal = ({modelsDetails, updateTagsList, onClose, updateTag = false, tagDetails = {}, clickCount}) => {
    const modelNameList = [];
    for(const modelName in modelsDetails) modelNameList.push(modelName);
    const [tagName, setTagName] = useState(tagDetails.hasOwnProperty('name') ?  tagDetails['name'] : '');
    const [tagDescription, setTagDescription] = useState(tagDetails.hasOwnProperty('description') ?  tagDetails['description'] : '');
    const Views = { TAG_DETIALS_INPUT_VIEW: 0, MODEL_VERSION_SELECTION_VIEW: 1 }
    const [currentView, setCurrentView] = useState(Views.TAG_DETIALS_INPUT_VIEW);
    const [selectedModel, setSelectedModel] = useState(null);
    const [selectedModels, setSelectedModels] = useState(() => {
        const preAttachedModels = getPreAttachedModels(tagDetails);
        return preAttachedModels;
    });
    
    const handleModelSelection = (model) => {
        setSelectedModel(model);
        setCurrentView(Views.MODEL_VERSION_SELECTION_VIEW);
    }

    const handleTagCreation = async () => {
        if(tagName == '') {
            toast.error("Please enter a vaid tag name", {
                toastId: "errorToast",
            });
            return;
        }
        if(tagDescription == '') {
            toast.error("Please enter a vaid tag description", {
                toastId: "errorToast",
            });
            return;
        };
        await createDeploymentTag({
            tagName: tagName,
            tagDescription: tagDescription,
            models: changeSelectedModelsDataStructure(selectedModels),
            updateTagsList: updateTagsList
        });
        onClose();
    }

    const handleTagUpdate = async () => {
        if(tagDescription == '') {
            toast.error("Please enter a vaid tag description", {
                toastId: "errorToast",
            });
            return;
        };
        await updateDeploymentTag({
            tagName: tagName,
            tagDescription: tagDescription,
            models: changeSelectedModelsDataStructure(selectedModels),
            updateTagsList: updateTagsList
        });
        onClose();
    }

    const clickBackFromModelVersionView = () => {
        setCurrentView(Views.TAG_DETIALS_INPUT_VIEW);
        setSelectedModel(null);
    }

    const handleModelVersionSelection = (modelName, selectedVersions) => {
        setSelectedModels(selectedModels => {
            if(Object.keys(selectedVersions).length == 0 && modelName in selectedModels) delete selectedModels[modelName];
            if(Object.keys(selectedVersions).length == 0) return selectedModels;
            selectedModels[modelName] = selectedVersions;
            return {...selectedModels};
        });
        setCurrentView(Views.TAG_DETIALS_INPUT_VIEW);
        setSelectedModel(null);
    }

    const handleModelVersionRemoval = (modelName, version) => {
        setSelectedModels(prevSelectedModels => {
            if(version in prevSelectedModels[modelName]) {
                delete prevSelectedModels[modelName][version];
                if(Object.keys(prevSelectedModels[modelName]).length == 0) delete prevSelectedModels[modelName];
            }
            return {...prevSelectedModels};
        })
    }

    useEffect(() => {
       if(clickCount > 0) updateTag ? handleTagUpdate() : handleTagCreation();
    }, [clickCount])

    return (
        <div className="create-new-tag-modal-content">
            { currentView == Views.TAG_DETIALS_INPUT_VIEW &&
                <>
                    <div className="create-new-tag-header">
                        <div className="create-new-tag-title">{updateTag ? 'Update compatiblity tag' : 'Create a new compatability tag'}</div>
                        {/* <button onClick={updateTag ? handleTagUpdate : handleTagCreation} className="newTag-saveButton">{updateTag ? 'Update' : 'Save'}</button> */}
                        {/* <img className={`create-new-tag-saveIcon ${(tagName == '' || tagDescription == '') ? 'save-disabled' : 'cursorPointer'}`} src={"/assets/icons/saveIcon.svg"} onClick={handleSave}></img> */}
                    </div>
                    <div className="create-new-tag-input-content">
                        <div className="create-new-tag-name-input subsection">
                            <div className="create-new-tag-name-input-header subsection-header">{updateTag ? 'Compatability tag name' : 'Enter compatability tag name'}</div>
                            <input className="input-box create-new-tag-name-input-box" type="text" value={tagName} onChange={(e) => setTagName(e.target.value)} placeholder="sample-tag-name-iOS" disabled={updateTag} style={updateTag ? {opacity: '0.5'} : {}}/>
                        </div>
                        <div className="create-new-tag-description subsection">
                            <div className="create-new-tag-description-header subsection-header">Enter compatability tag description</div>
                            <input className="input-box create-new-tag-description-input-box" type="text" value={tagDescription} onChange={(e) => setTagDescription(e.target.value)} placeholder="Enter a description" />
                        </div>
                        <div className="selected-model-versions subsection">
                                <div className="selected-model-versions-header subsection-header">Selected Model & Versions</div>
                                {Object.keys(selectedModels).length > 0 && <DisplayCards selectedModels={{...selectedModels}} handleModelVersionRemoval={handleModelVersionRemoval}/>}
                                {Object.keys(selectedModels).length == 0 && <div className="create-new-tag-no-model-selected">No Model Selected</div>}
                        </div>
                        <div className="create-new-tag-model-mapping subsection">
                            <div className="create-new-tag-model-mapping-header subsection-header">Map CT with the pre-existing models (optional)</div>
                            <Search list={modelNameList} handleItemClick={handleModelSelection} placeholder={"Search Models"}/>
                        </div>
                    </div>
                </>
            }
            { currentView == Views.MODEL_VERSION_SELECTION_VIEW && <ModelVersionSelection modelName={selectedModel} preSelectedVersions={selectedModel in selectedModels ? selectedModels[selectedModel] : {}} modelDetails={modelsDetails[selectedModel]} onClickBack={clickBackFromModelVersionView} handleSave={handleModelVersionSelection}/>}
        </div>
    )
}