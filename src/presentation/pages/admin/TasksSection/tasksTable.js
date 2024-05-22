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
import HoverText from "presentation/components/HoverText/hoverText";

const taskTableView = {
    NEW_TASK_VIEW: 0,
    UPDATE_TASK_VIEW: 1
}

const TasksTable = ({ tasksDetails, allTagsList, updateTasksList, isUpdateTaskModalOpen, setIsUpdateTaskModalOpen, setCodeEditorAsOpen }) => {
    const [tasksViewData, updateTasksViewData] = useState({
        headers: [
            { text: 'Version' },
            { text: 'Description' },
            { text: 'Actions' }
        ],
        body: [],
    });
    //const [isUpdateTaskModalOpen, setIsUpdateTaskModalOpen] = useState(false);
    const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
    const [currentView, setCurrentView] = useState(null);

    useEffect(() => {
        if (tasksDetails.hasOwnProperty(DEFAULT_TASK_NAME)) {
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

    const taskActionColComponent = ({ taskVersion }) => {
        return (
            <div className="taskActionCol flex">
                <FileDownloadComponent fetchFunction={fetchTaskFile} fetchFuncData={{ taskVersion: taskVersion }} fileName={DEFAULT_TASK_NAME} />
                <HoverText onHoverText={"Edit Scipt"}>
                    <img onClick={() => { setCodeEditorAsOpen(taskVersion); }} style={{ height: "20px", cursor: "pointer", marginLeft: "12px" }} src="/assets/icons/edit.svg"></img>
                </HoverText>
            </div>

        )
    }

    useEffect(() => {
        tasksViewData.body = [];
        for (const taskName in tasksDetails) {
            if (taskName != DEFAULT_TASK_NAME) continue;
            for (const taskVersion in tasksDetails[taskName]['versions']) {
                const tagsArray = [];
                for (const tag in tasksDetails[taskName]['versionToTags'][taskVersion]) tagsArray.push(tag);
                tasksViewData.body.push([
                    { Component: TextOnlyComponent, data: { text: taskVersion, customStyle: { fontWeight: 500, color: '#494949', fontSize: '14px' }, highlightOnHover: true } },
                    { Component: TextOnlyComponent, data: { text: tasksDetails[taskName]['versions'][taskVersion]['description'], customStyle: { color: '#74828F', fontWeight: 400, fontSize: '14px' }, highlightOnHover: true } },
                    { Component: taskActionColComponent, data: { taskVersion: taskVersion } }
                ]);
            }
            break;
        }
        updateTasksViewData({ ...tasksViewData });
        if (tasksDetails.hasOwnProperty(DEFAULT_TASK_NAME)) {
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
                    {/* <div className="existing-script-header">
                        <div className="script-name">DEFAULT_SCRIPT</div>
                        <button onClick={openUpdateTaskModal} className="updateTaskButton">Update Workflow Script</button>
                    </div> */}
                    {isUpdateTaskModalOpen &&
                        <Modal isOpen={isUpdateTaskModalOpen} onClose={closeUpdateTaskModal} customStyle={{ height: '654px' }}>
                            <TaskUpdate allTagsList={allTagsList} onCompletion={closeUpdateTaskModal} updateTasksList={updateTasksList} />
                        </Modal>
                    }
                    <Table data={tasksViewData} />
                </div>
            }
            {
                currentView == taskTableView.NEW_TASK_VIEW &&
                <>
                    <button onClick={openNewTaskModal} className="uploadNewTaskButton">Upload Script</button>
                    {isNewTaskModalOpen &&
                        <Modal isOpen={isNewTaskModalOpen} onClose={closeNewTaskModal} customStyle={{ height: '654px' }}>
                            <TaskUpdate allTagsList={allTagsList} isNewTask={true} onCompletion={closeNewTaskModal} updateTasksList={updateTasksList} />
                        </Modal>
                    }
                </>
            }
        </>
    )
}

export default TasksTable;