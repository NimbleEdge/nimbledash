import Table, { TextOnlyComponent } from "presentation/components/Table/table";
import '../../../../common.css';
import '../admin_page.css';
import './modelDetailsTable.css';
import React, { useEffect, useRef, useState } from "react";
import Modal from "presentation/components/modal/modal";
import { addDeploymentTags, fetchActiveUsers } from "data/apis";
import { CardsList, SelectableCardsList } from "presentation/components/RectangularCards/rectangularCards";
import { TagsListComponent } from "presentation/components/Tags/tagsList";
import { downloadModel } from "../modelsTable/modelDownload";
import Search from "presentation/components/Search/searchComponent";

const AddTagsToModel = ({existingTags, allTagsList, modelName, version, updateTagsList, onCloseModal, attemptSave}) => {
    const [selectedTags, setSelectedTags] = useState([]);
    const remainingTagsList = []
    allTagsList.forEach(tag => {
        if(!(tag.name in existingTags)) remainingTagsList.push(tag.name);
    });
    const existingTagsList = [];
    for(const tag in existingTags) existingTagsList.push({title: tag});
    
    const toggleTag = (tag) => {
        setSelectedTags((prevTags) => {
            if (prevTags.includes(tag)) {
                return prevTags.filter((selectedTag) => selectedTag !== tag);
            } else {
                return [...prevTags, tag];
            }
        });
    };

    const handleSave = async () => {
        const existingTagsName = existingTagsList.map(tag => tag.title);
        await addDeploymentTags(modelName, version, [...selectedTags, ...existingTagsName], null, updateTagsList);
        onCloseModal();
    }

    useEffect(() => {
        if(attemptSave > 0) handleSave();
    }, [attemptSave])

    return (
        <div className="select-tags-modal-content">
            <div className="selectable-tags-container">
                <div className="model-details-header-container">
                    <div className="model-details-header-container-text">{modelName} - v{version}</div>
                    {/* <img className={"saveIcon"} src={"/assets/icons/saveIcon.svg"} onClick={handleSave}></img> */}
                </div>
                <div className="selectable-tags-list">
                    <Search list={remainingTagsList} handleItemClick={toggleTag}/>
                </div>
            </div>
            {selectedTags.length > 0 &&
                <div className="selected-tags-container">
                    <div className="selected-tags-list-header">Selected Tags</div>
                    <CardsList cards={selectedTags.map(tag => {return {title: tag}})} customStyle={{box: {backgroundColor: '#6565FF1A'}}} />
                </div>
            }
            <div className="existing-tags-container">
                <div className="existing-tags-list-header">Previously attached deployment tags</div>
                <CardsList cards={existingTagsList} customStyle={{box: {backgroundColor: '#6565FF1A'}}} />
            </div>
        </div>
  );
}

const VersionColumnComponent = ({version, existingTags, allTagsList, modelName, updateTagsList}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    return (
        <>
            <div className={`version`} onClick={() => openModal()}>
                {`v${version}`}
            </div>
            {
                isModalOpen && 
                <Modal isOpen={isModalOpen} onClose={closeModal} hasSaveButton={true}>
                    {
                        ({attemptSave}) => {
                            return (
                                <AddTagsToModel existingTags={existingTags} allTagsList={allTagsList} modelName={modelName} version={version} updateTagsList={updateTagsList} onCloseModal={closeModal} attemptSave={attemptSave} />
                            );
                        }
                    }
                </Modal>
            }
        </>
    )
}

const ActionColComponent = ({modelName, modelVersion}) => {
    return (
        <div className="actionColCell">
            <img className={"download-model-icon"} src={"/assets/icons/download.svg"} onClick={() => downloadModel({modelName: modelName, modelVersion: modelVersion})}></img>
            {/* <button className="download-model-button" onClick={() => downloadModel({modelName: modelName, modelVersion: modelVersion})}>Download</button> */}
        </div>
    )
}

const ModelDetailsTable = ({modelDetails, modelName, allTagsList, updateTagsList}) => {
    const [modelDetailsView, updateModelDetailsView] = useState({
        headers: [{text: 'Versions'}, {text: 'Actions'}, {text: 'Compatability Tags'}, {text: 'Active Users ( last 7 days )'}],
        body: []
    });
    const [activeUsers, updateActiveUsers] = useState({});

    useEffect(() => {
        const fetchVersionWiseActiveUsers = async () => {
            const promises = [];
            for(const version in modelDetails['versionToTags']) {
                const request = fetchActiveUsers(modelName, version);
                promises.push(request);
            }
            const results = await Promise.all(promises);
            results.forEach((data) => {
                for(const version in data.activeUsersTrends) {
                    activeUsers[version] = data['activeUsersTrends'][version];
                }
            });
            updateActiveUsers({...activeUsers});
        }
        fetchVersionWiseActiveUsers();
    }, [])

    useEffect(() => {
        modelDetailsView.body = [];
        for(const version in modelDetails['versionToTags']) {
            let tagsList = [];
            let existingTags = {};
            for(const tag in  modelDetails['versionToTags'][version]) {
                tagsList.push(tag);
                existingTags[tag] = true;
            }
            modelDetailsView.body.push([{Component: VersionColumnComponent, data: {version: version, existingTags: existingTags, allTagsList: allTagsList, modelName: modelName, updateTagsList: updateTagsList}}, {Component: ActionColComponent, data: {modelName: modelName, modelVersion: version}}, {Component: TagsListComponent, data: {tags: [...tagsList], truncationLimit: 10000}}, {Component: TextOnlyComponent, data:{text: activeUsers[version]}}]);
        }
        updateModelDetailsView({...modelDetailsView});
    }, [modelDetails, activeUsers])
    
    return (
        <div className={`modelDetailsTableView flexColumn overflowAuto`}>
            <Table data={modelDetailsView}/>
        </div>
    )
}

export default ModelDetailsTable;