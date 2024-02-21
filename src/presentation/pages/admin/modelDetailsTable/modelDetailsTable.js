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
import { RectCard } from "presentation/components/RectangularCards/card";
import HoverText from "presentation/components/HoverText/hoverText";

const AddTagsToModel = ({existingTags, allTagsList, modelName, version, updateTagsList, onCloseModal, clickCount}) => {
    const [selectedTags, setSelectedTags] = useState([]);
    let remainingTagsList = [];
    allTagsList.forEach(tag => {
        if(!(tag.name in existingTags) && !selectedTags.includes(tag.name)) remainingTagsList.push(tag.name);
    });
    const existingTagsList = [];
    for(const tag in existingTags) existingTagsList.push({title: tag});

    const addTagToSelectedList = (card) => {
        setSelectedTags((prevTags) => {
            if(prevTags.includes(card.title)) return [...prevTags];
            else {
                return [...prevTags, card.title]
            }
        })
    }

    const handleSave = async () => {
        const existingTagsName = existingTagsList.map(tag => tag.title);
        await addDeploymentTags(modelName, version, [...selectedTags, ...existingTagsName], null, updateTagsList);
        onCloseModal();
    }

    const removeSelectedTag = (card) => {
        setSelectedTags((prevTags) => [...prevTags.filter((selectedTag) => selectedTag !== card.title)]);
    }

    useEffect(() => {
        if(clickCount > 0) handleSave();
    }, [clickCount])

    return (
        <div className="model-details-select-tags-modal-content">
            <div className="model-details-selectable-tags-container">
                <div className="model-details-header-container">
                    <div className="model-details-header-container-text">{modelName} - v{version}</div>
                </div>
                <Search searchList={remainingTagsList.map(tag => { return {searchText: tag, selected: false}})} handleItemClick={addTagToSelectedList}/>
            </div>
            {selectedTags.length > 0 &&
                <div className="model-details-selected-tags-container">
                    <div className="model-details-selected-tags-list-header">Selected Tags</div>
                    <div className="model-details-selected-tags-list">
                        {selectedTags.map((tag) => <RectCard  card={{title: tag}} customStyle={{box: {backgroundColor: '#6565FF1A'}}} hasRemoveButton={true} handleRemove={removeSelectedTag} />)}
                    </div>
                </div>
            }
            <div className="model-details-existing-tags-container">
                <div className="model-details-existing-tags-list-header">Previously attached deployment tags</div>
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
                <Modal isOpen={isModalOpen} onClose={closeModal} hasSaveButton={true} customStyle={{height: '586px'}}>
                    {
                        ({clickCount}) => {
                            return (
                                <AddTagsToModel existingTags={existingTags} allTagsList={allTagsList} modelName={modelName} version={version} updateTagsList={updateTagsList} onCloseModal={closeModal} clickCount={clickCount} />
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
            <HoverText onHoverText={"Download"}>
                <img className={"download-model-icon"} src={"/assets/icons/download.svg"} onClick={() => downloadModel({modelName: modelName, modelVersion: modelVersion})}></img>
            </HoverText>
        </div>
    )
}

const ModelDetailsTable = ({modelDetails, modelName, allTagsList, updateTagsList}) => {
    const [modelDetailsView, updateModelDetailsView] = useState({
        headers: [
            {text: 'Versions'}, 
            {text: 'Compatability Tags'}, 
            {text: 'Active Users ( last 7 days )'},
            {text: 'Actions'},
        ],
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
            modelDetailsView.body.push([
                {Component: VersionColumnComponent, data: {version: version, existingTags: existingTags, allTagsList: allTagsList, modelName: modelName, updateTagsList: updateTagsList, highlightOnHover: true}}, 
                {Component: TagsListComponent, data: {tags: [...tagsList], highlightOnHover: true}}, 
                {Component: TextOnlyComponent, data:{text: activeUsers[version], highlightOnHover: true}},
                {Component: ActionColComponent, data: {modelName: modelName, modelVersion: version}}
            ]);
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