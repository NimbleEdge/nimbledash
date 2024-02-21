import Table, { TextOnlyComponent } from "presentation/components/Table/table";
import '../../../../common.css';
import '../admin_page.css';
import './tagsTable.css';
import React, { useEffect, useState } from "react";
import Modal from "presentation/components/modal/modal";
import { TagsListComponent } from "presentation/components/Tags/tagsList";
import TruncatedDescription from "./TagsDescription/tagDescription";
import { CreateOrUpdateTagModal } from "./TagCreationAndUpdation/TagCreationAndUpdation";
import { DEFAULT_TASK_NAME } from "../new_admin_page";
import CreateNewTagModal from "./TagCreationAndUpdation/CreateNewTagModal";

const TagsTable = ({tagsDetails, modelsDetails, tasksDetails, updateTagsList, isCreateNewTagModalOpen, setIsCreateNewTagModalOpen}) => {
    const [tagsViewData, updateTagsViewData] = useState({
        headers: [
            {text: 'Compatibility Tags'}, 
            {text: 'Description'}, 
            {text: 'Task Versions'}, 
            {text: 'Models'}
        ],
        body: [],
    });

    useEffect(() => {
        updateTagsViewData({...tagsViewData});
    }, [modelsDetails])

    useEffect(() => {
        tagsViewData.body = [];
        for(const tag in tagsDetails) {
            const taskTableData = {
                headers: [{text: 'Versions'}, {text: 'Description'}],
                body: []
            }
            const tasksArray = [];
            if(DEFAULT_TASK_NAME in tagsDetails[tag]['tasks'] && DEFAULT_TASK_NAME in tasksDetails){
                tagsDetails[tag]['tasks'][DEFAULT_TASK_NAME].forEach(version => {
                    tasksArray.push('v' + version);
                    taskTableData.body.push([{Component: TextOnlyComponent, data: {text: 'v' + version, customStyle: {fontWeight: '500', fontSize: '14px', color: '#494949', fontFamily: 'Poppins'}}}, {Component: TextOnlyComponent, data: {text: tasksDetails[DEFAULT_TASK_NAME]['versions'][version]['description'], customStyle: {fontWeight: '400', fontSize: '14px', color: '#74828F', fontFamily: 'Poppins'}}}])
                })
            }
            const modelsArray = [];
            const modelTableData = {
                headers: [{text: 'Model Name'}, {text: 'Version'}],
                body: []
            }
            for(const model in tagsDetails[tag]['models']) {
                modelsArray.push(model);
                tagsDetails[tag]['models'][model].forEach(version => {
                    modelTableData.body.push([{Component: TextOnlyComponent, data: {text: model, customStyle: {fontWeight: '500', fontSize: '14px', color: '#494949', fontFamily: 'Poppins'}}}, {Component: TextOnlyComponent, data: {text: 'v' + version, customStyle: {fontWeight: '400', fontSize: '14px', color: '#74828F', fontFamily: 'Poppins'}}}])
                })
            }
            tagsViewData.body.push([
                {Component: TagNameColumnComponent, data: {tagName: tag, modelsDetails: modelsDetails, updateTagsList: updateTagsList, tagDetails: tagsDetails[tag], highlightOnHover: true}}, 
                {Component: TruncatedDescription, data: {message: tagsDetails[tag]['description'], maxLength: 400, modelsDetails: modelsDetails, updateTagsList: updateTagsList, tagDetails: tagsDetails[tag], tagName: tag, highlightOnHover: true}}, 
                {Component: TagsListComponent, data: {tags: tasksArray, tableData: taskTableData, tableTitle: "Linked Task Versions",truncationLimit: 2, expandable: true, highlightOnHover: true}}, 
                {Component: TagsListComponent, data: {tags: modelsArray, truncationLimit: 2, tableData: modelTableData, tableTitle: "Linked Models", expandable: true, highlightOnHover: true}}
            ]);
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
            {isCreateNewTagModalOpen && <CreateNewTagModal modelsDetails={modelsDetails} updateTagsList={updateTagsList} isModalOpen={isCreateNewTagModalOpen} setIsModalOpen={setIsCreateNewTagModalOpen} />}
            <Table data={tagsViewData} customStyles={customStyles}/>
        </div>
    )
}

export default TagsTable;

const TagNameColumnComponent = ({tagName, modelsDetails, updateTagsList, tagDetails}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    return (
        <>
            <div className={`tags-name-column`} onClick={openModal}>
                {tagName}
            </div>
            {
                isModalOpen && 
                <Modal isOpen={isModalOpen} onClose={closeModal} customStyle={{maxHeight: '90%', height: '654px'}} hasSaveButton={true} >
                    {
                        ({clickCount}) => {
                            return (
                                <CreateOrUpdateTagModal modelsDetails={modelsDetails} updateTagsList={updateTagsList} onClose={closeModal} updateTag={true} tagDetails={{...tagDetails, 'name': tagName}} clickCount={clickCount} />
                            );
                        }
                    }
                </Modal>
            }
        </>
    )
}