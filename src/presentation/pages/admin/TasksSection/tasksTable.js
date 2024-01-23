import Table, { TextOnlyComponent } from "presentation/components/Table/table";
import '../../../../common.css';
import '../admin_page.css';
import './tasksTable.css';
import React, { useEffect, useState } from "react";
import { TagsListComponent } from "presentation/components/Tags/tagsList";
import Modal from "presentation/components/modal/modal";
import TaskUpdate from "./taskUpdate";
import { DEFAULT_TASK_NAME } from "../new_admin_page";
import { fetchTaskFile } from "data/apis";
import FileDownloadComponent from "presentation/components/FileDownload/fileDownload";
import { toast } from "react-toastify";


const taskTableView = {
    NEW_TASK_VIEW: 0,
    UPDATE_TASK_VIEW: 1
}

const taskActionColComponent = ({taskVersion}) => {
    return (
        <FileDownloadComponent fetchFunction={fetchTaskFile} fetchFuncData={{taskVersion: taskVersion}} fileName={DEFAULT_TASK_NAME} />
    )
}

const TasksTable = ({tasksDetails, allTagsList, updateTasksList}) => {
    const [tasksViewData, updateTasksViewData] = useState({
        headers: [{text: 'Version'}, {text: 'Actions'}, {text: 'Compatability Tags'}, {text: 'Description'}],
        body: [],
    });
    const [isUpdateTaskModalOpen, setIsUpdateTaskModalOpen] = useState(false);
    const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
    const [currentView, setCurrentView] = useState(null);

    useEffect(() => {
        if(tasksDetails.hasOwnProperty(DEFAULT_TASK_NAME)) {
            setCurrentView(taskTableView.UPDATE_TASK_VIEW);
        } else {
            setCurrentView(taskTableView.NEW_TASK_VIEW);
        }
    }, [])

    const openNewTaskModal = () => {
        setIsNewTaskModalOpen(true);
    };

    const closeNewTaskModal = () => {
        setIsNewTaskModalOpen(false);
    };

    const openUpdateTaskModal = () => {
        setIsUpdateTaskModalOpen(true);
    };

    const closeUpdateTaskModal = () => {
        setIsUpdateTaskModalOpen(false);
    };

    useEffect(() => {
        tasksViewData.body = [];
        for(const taskName in tasksDetails) {
            if(taskName != DEFAULT_TASK_NAME) continue;
            for(const taskVersion in tasksDetails[taskName]['versions']) {
                const tagsArray = [];
                for(const tag in tasksDetails[taskName]['versionToTags'][taskVersion]) tagsArray.push(tag);
                tasksViewData.body.push([{Component: TextOnlyComponent, data: {text: taskVersion}}, {Component: taskActionColComponent, data: {taskVersion: taskVersion}}, {Component: TagsListComponent, data: {tags: tagsArray}}, {Component: TextOnlyComponent, data: {text: tasksDetails[taskName]['versions'][taskVersion]['description']}}]);
            }
            break;
        }
        updateTasksViewData({...tasksViewData});
        if(tasksDetails.hasOwnProperty(DEFAULT_TASK_NAME)) {
            setCurrentView(taskTableView.UPDATE_TASK_VIEW);
        } else {
            setCurrentView(taskTableView.NEW_TASK_VIEW);
        }
    }, [tasksDetails])
    
    return (
        <>
            {
                currentView == taskTableView.UPDATE_TASK_VIEW &&
                <div className={`tasksTableView flexColumn overflowAuto`}>
                    <div className="existing-script-header">
                        <div className="script-name">DEFAULT_SCRIPT</div>
                        <button onClick={openUpdateTaskModal} className="updateTaskButton">Update Workflow Script</button>
                    </div>
                    {isUpdateTaskModalOpen && 
                        <Modal isOpen={isUpdateTaskModalOpen} onClose={closeUpdateTaskModal}>
                            <TaskUpdate allTagsList={allTagsList} onCompletion={closeUpdateTaskModal} updateTasksList={updateTasksList} />
                        </Modal>
                    }
                    <Table data={tasksViewData}/>
                </div>
            }
            {
                currentView == taskTableView.NEW_TASK_VIEW &&
                <>
                    <button onClick={openNewTaskModal} className="uploadNewTaskButton">Upload Script</button>
                    {isNewTaskModalOpen && 
                        <Modal isOpen={isNewTaskModalOpen} onClose={closeNewTaskModal}>
                            <TaskUpdate allTagsList={allTagsList} isNewTask={true} onCompletion={closeNewTaskModal} updateTasksList={updateTasksList} />
                        </Modal>
                    }
                </>
            }
        </>
    )
}

export default TasksTable;