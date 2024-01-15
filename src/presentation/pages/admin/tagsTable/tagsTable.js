import Table from "presentation/components/Table/table";
import '../../../../common.css';
import '../admin_page.css';
import './tagsTable.css';
import React, { useEffect, useState } from "react";
import Modal from "presentation/components/modal/modal";
import Search from "../../../components/Search/searchComponent";
import { createDeploymentTag } from "data/apis";
import { TagsListComponent } from "presentation/components/Tags/tagsList";
import TruncatedDescription from "../modelDetailsTable/TagsDescription/tagDescription";
import { toast } from "react-toastify";

const ModelVersionSelection = ({modelName, modelDetails, preSelectedVersions, onClickBack, handleSave}) => {
    let modelVersions = [];
    for(const version in modelDetails['versions']) {
        modelVersions.push(version);
    }
    const [selectedVersions, setSelectedVersions] = useState(preSelectedVersions);
    const handleVersionClick = (version) => {
        setSelectedVersions(prevSelectedVersions => {
            if (prevSelectedVersions.includes(version)) {
                return prevSelectedVersions.filter(selectedVersion => selectedVersion !== version);
            } else {
                return [...prevSelectedVersions, version];
            }
        });
    }

    return (
        <>
            <div className="create-new-tag-model-version-selection-header">
                <img className={"backArrow"} src={"/assets/icons/backArrow.svg"} onClick={onClickBack}></img>
                <div className="create-new-tag-version-selection-title">Create A New Compatability Tag &gt; {modelName}</div>
                <button onClick={(e) => handleSave(modelName, selectedVersions)} className="newTag-modelVersion-selection-button">Update Selection</button>
                {/* <img className={"create-new-tag-saveIcon"} src={"/assets/icons/saveIcon.svg"} onClick={(e) => handleSave(modelName, selectedVersions)}></img> */}
            </div>
            <div className="create-new-tag-model-version-selection">
                {modelVersions.map((version) => (
                    <div key={version} className={`version-box ${selectedVersions.includes(version) ? 'selected-version-box' : 'not-selected-version-box'}`} onClick={(e) => handleVersionClick(version)}>
                        <div className={`version-text ${selectedVersions.includes(version) ? 'selected-version-text' : 'not-selected-version-text'}`}>{version}</div>
                    </div>
                ))}
            </div>
        </>
    )
}


const DisplayCards = ({selectedModels}) => {
    const cards = [];
    for(const model in selectedModels) {
        const title = model;
        let subtitle = "";
        selectedModels[model].forEach((version, index) => {
            if(index == 0) subtitle += `${version} `;
            else subtitle += `  ,  ${version} `;
        });
        cards.push({title: title, subtitle: subtitle});
    }
    return (
        <div className="cards-list">
            {cards.map((card) => (
                <div key={card.title} className={`card-box`}>
                    <div className={`card-title`}>{card.title}</div>
                    <div className={`card-subtitle`}>{card.subtitle}</div>
                </div>
            ))}
        </div>
    )
}

const CreateNewTagModal = ({modelsDetails, updateTagsList, onClose}) => {
    const modelNameList = [];
    for(const modelName in modelsDetails) modelNameList.push(modelName);
    const [tagName, setTagName] = useState('');
    const [tagDescription, setTagDescription] = useState("");
    const Views = { TAG_DETIALS_INPUT_VIEW: 0, MODEL_VERSION_SELECTION_VIEW: 1 }
    const [currentView, setCurrentView] = useState(Views.TAG_DETIALS_INPUT_VIEW);
    const [selectedModel, setSelectedModel] = useState(null);
    const [selectedModels, setSelectedModels] = useState({});
    const handleModelSelection = (model) => {
        setSelectedModel(model);
        setCurrentView(Views.MODEL_VERSION_SELECTION_VIEW);
    }
    const handleSave = async () => {
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
            models: selectedModels,
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
            if(selectedVersions.length == 0 && modelName in selectedModels) delete selectedModels[modelName];
            if(selectedVersions.length == 0) return selectedModels;
            selectedModels[modelName] = selectedVersions;
            return {...selectedModels };
        });
        setCurrentView(Views.TAG_DETIALS_INPUT_VIEW);
        setSelectedModel(null);
    }
    return (
        <div className="create-new-tag-modal-content">
            { currentView == Views.TAG_DETIALS_INPUT_VIEW &&
                <>
                    <div className="create-new-tag-header">
                        <div className="create-new-tag-title">Create A New Compatability Tag</div>
                        <button onClick={handleSave} className="newTag-saveButton">Save</button>
                        {/* <img className={`create-new-tag-saveIcon ${(tagName == '' || tagDescription == '') ? 'save-disabled' : 'cursorPointer'}`} src={"/assets/icons/saveIcon.svg"} onClick={handleSave}></img> */}
                    </div>
                    <div className="create-new-tag-input-content">
                        <div className="create-new-tag-name-input subsection">
                            <div className="create-new-tag-name-input-header subsection-header">•  enter compatability tag name</div>
                            <input className="input-box create-new-tag-name-input-box" type="text" value={tagName} onChange={(e) => setTagName(e.target.value)} placeholder="sample-tag-name-iOS" />
                        </div>
                        <div className="create-new-tag-description subsection">
                            <div className="create-new-tag-description-header subsection-header">•  enter compatability tag description</div>
                            <input className="input-box create-new-tag-description-input-box" type="text" value={tagDescription} onChange={(e) => setTagDescription(e.target.value)} placeholder="discription" />
                        </div>
                        <div className="selected-model-versions subsection">
                                <div className="selected-model-versions-header subsection-header">•  Selected Model & Versions</div>
                                {Object.keys(selectedModels).length > 0 && <DisplayCards selectedModels={{...selectedModels}} />}
                                {Object.keys(selectedModels).length == 0 && <div className="create-new-tag-no-model-selected">No Model Selected</div>}
                        </div>
                        <div className="create-new-tag-model-mapping subsection">
                            <div className="create-new-tag-model-mapping-header subsection-header">•  map CT with the pre-existing models (optional)</div>
                            <Search list={modelNameList} handleItemClick={handleModelSelection}/>
                        </div>
                    </div>
                </>
            }
            { currentView == Views.MODEL_VERSION_SELECTION_VIEW && <ModelVersionSelection modelName={selectedModel} preSelectedVersions={selectedModel in selectedModels ? selectedModels[selectedModel] : []} modelDetails={modelsDetails[selectedModel]} onClickBack={clickBackFromModelVersionView} handleSave={handleModelVersionSelection}/>}
        </div>
    )
}

const CreateNewTagButton = ({modelsDetails, updateTagsList}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    return (
        <>
            <div className="create-new-tag-footer" onClick={openModal}>
                <div className={`create-plus-sign`}>+</div>
                <div>Create new tag</div>
            </div>
            {
                isModalOpen && 
                <Modal isOpen={isModalOpen} onClose={closeModal} customStyle={{height: '600px', overflow: 'auto'}}>
                    <CreateNewTagModal modelsDetails={modelsDetails} updateTagsList={updateTagsList} onClose={closeModal}/>
                </Modal>
            }
        </>
    )
}

const TagNameColumnComponent = ({tagName}) => {
    return (
        <>
            <div className={`tags-name-column`}>
                {tagName}
            </div>
        </>
    )
}

const TagDescription = ({description}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    return(
        <>
            <div className="tags-description-column" onMouseOver={openModal} >
                {description}
            </div>
            {
                isModalOpen && 
                <Modal isOpen={isModalOpen} onClose={closeModal}>
                    {<div>{description}</div>}
                </Modal>
            }
        </>
    );
}

const TagsTable = ({tagsDetails, modelsDetails, updateTagsList}) => {
    const [tagsViewData, updateTagsViewData] = useState({
        headers: [{text: 'Compatibility Tags'}, {text: 'Description'}, {text: 'Models'}],
        body: [],
        footer: {Component: CreateNewTagButton, data: {modelsDetails: modelsDetails, updateTagsList: updateTagsList}}
    });

    useEffect(() => {
        tagsViewData.footer.data.modelsDetails = modelsDetails;
        updateTagsViewData({...tagsViewData});
    }, [modelsDetails])

    useEffect(() => {
        tagsViewData.body = [];
        for(const tag in tagsDetails) {
            const modelsArray = [];
            for(const model in tagsDetails[tag]['models']) modelsArray.push(model);
            tagsViewData.body.push([{Component: TagNameColumnComponent, data: {tagName: tag}}, {Component: TruncatedDescription, data: {message: tagsDetails[tag]['description'], maxLength: 400}}, {Component: TagsListComponent, data: {tags: modelsArray}}]);
        }
        updateTagsViewData({...tagsViewData});
    }, [tagsDetails]);

    const customStyles = {
        headerCell : {
            padding: '6px 24px 6px 24px',
            backgroundColor: '#6565FF1A',
            minWidth: '170px'
        }
    }
    
    return (
        <div className={`tagsTableView flexColumn overflowAuto`}>
            <Table data={tagsViewData} customStyles={customStyles}/>
        </div>
    )
}

export default TagsTable;