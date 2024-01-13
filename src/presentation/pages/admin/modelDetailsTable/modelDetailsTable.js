import Table from "presentation/components/Table/table";
import '../../../../common.css';
import '../admin_page.css';
import './modelDetailsTable.css';
import React, { useEffect, useState } from "react";
import Modal from "presentation/components/modal/modal";
import { addDeploymentTags } from "data/apis";
import { CardsList, SelectableCardsList } from "presentation/components/RectangularCards/rectangularCards";
import { TagsListComponent } from "presentation/components/Tags/tagsList";


const AddTagsToModel = ({existingTags, allTagsList, modelName, version, updateTagsList, onCloseModal}) => {
    const [selectedTags, setSelectedTags] = useState([]);

    const remainingTagsList = [];
    const existingTagsList = [];
    allTagsList.forEach(tag => {
        if(!(tag.name in existingTags)) remainingTagsList.push({title: tag.name});
    })
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

    return (
        <div className="select-tags-modal-content">
            <div className="selectable-tags-container">
                <div className="model-details-header-container">
                    <div className="model-details-header-container-text">{modelName} - v{version}</div>
                    <img className={"saveIcon"} src={"/assets/icons/saveIcon.svg"} onClick={handleSave}></img>
                </div>
                <div className="selectable-tags-list">
                    <SelectableCardsList cards={remainingTagsList} selectedCards={selectedTags} handleCardClick={toggleTag} />
                </div>
            </div>
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
                <Modal isOpen={isModalOpen} onClose={closeModal}>
                    <AddTagsToModel existingTags={existingTags} allTagsList={allTagsList} modelName={modelName} version={version} updateTagsList={updateTagsList} onCloseModal={closeModal} />
                </Modal>
            }
        </>
    )
}

const ModelDetailsTable = ({modelDetails, modelName, allTagsList, updateTagsList}) => {
    const [modelDetailsView, updateModelDetailsView] = useState({
        headers: [{text: 'Versions'}, {text: 'Compatability Tags'}],
        body: []
    });

    useEffect(() => {
        modelDetailsView.body = [];
        for(const version in modelDetails['versionToTags']) {
            let tagsList = [];
            let existingTags = {};
            for(const tag in  modelDetails['versionToTags'][version]) {
                tagsList.push(tag);
                existingTags[tag] = true;
            }
            modelDetailsView.body.push([{Component: VersionColumnComponent, data: {version: version, existingTags: existingTags, allTagsList: allTagsList, modelName: modelName, updateTagsList: updateTagsList}}, {Component: TagsListComponent, data: {tags: [...tagsList]}}]);
        }
        updateModelDetailsView({...modelDetailsView});
    }, [modelDetails])
    
    return (
        <div className={`modelDetailsTableView flexColumn overflowAuto`}>
            <Table data={modelDetailsView}/>
        </div>
    )
}

export default ModelDetailsTable;