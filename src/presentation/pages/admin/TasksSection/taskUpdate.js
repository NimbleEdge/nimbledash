import React, { useRef, useState } from "react";
import "../admin_page.css";
import { toast } from "react-toastify";
import { createNewTask, updateTask } from "data/apis";
import DropdownComponent from "presentation/components/dropdownMenu/dropdown";
import "./taskUpdate.css";
import { SelectableCardsList } from "presentation/components/RectangularCards/rectangularCards";
import { DEFAULT_TASK_NAME } from "../adminPage";
import { useDispatch } from "react-redux";

const upadteTaskView = {
    UPDATE_TASK_VIEW: 0,
    CT_SELECTION_VIEW: 1
}

const TaskUpdate = ({preSelectedTagsList = [], allTagsList, isNewTask = false, onCompletion, updateTasksList }) => {
    const dispatch = useDispatch();
    const updateTypes = ["Build", "Update", "Fix"];
    const [selectedUpdateTypeIndex, setSelectedUpdateTypeIndex] = useState(0);
    const [description, setDescription] = useState('');
    const [fileContent, setFileContent] = useState('');
    const [fileInfo, setFileInfo] = useState({ name: '', size: 0 });
    const fileInputRef = useRef(null);
    const [selectedDeploymentTags, setSelectedDeploymentTags] = useState(preSelectedTagsList);
    const [currentView, setCurrentView] = useState(upadteTaskView.UPDATE_TASK_VIEW);

    const handleTagSelection = (tag) => {
        setSelectedDeploymentTags(prevSelectedTags => {
            if (prevSelectedTags.includes(tag)) {
                return prevSelectedTags.filter(selectedTag => selectedTag !== tag);
            } else {
                return [...prevSelectedTags, tag];
            }
        });
    }


    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    const handleDivClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.name.endsWith('.py')) {
            setFileInfo({ name: file.name, size: file.size });
            const reader = new FileReader();
            reader.onload = (e) => {
                // @ts-ignore
                setFileContent(e.target.result);
            };
            reader.readAsText(file);
        } else {
        toast.error("Upload a .py file", {
            toastId: "errorToast",
        });
        }
    };

    const handleSubmit = () => {
        if(isNewTask) {
            createNewTask({taskName: DEFAULT_TASK_NAME, deploymentTags: selectedDeploymentTags, taskCode: fileContent, description: description, onCompletion, updateTasksList: updateTasksList, dispatch: dispatch})

        } else {
            updateTask({taskName: DEFAULT_TASK_NAME, deploymentTags: selectedDeploymentTags, taskCode: fileContent, updateType: selectedUpdateTypeIndex + 1, description: description, onCompletion, updateTasksList: updateTasksList});
        }
    };

  return (
    <>
        {currentView == upadteTaskView.UPDATE_TASK_VIEW &&
        <div className="modelUploadModal">
                <p className="heading4">{isNewTask ? 'Upload' : 'Update'} {'Workflow Script'}</p>
                <div className="upload-card-grid">
                    <div className="upload-card clickable" onClick={handleDivClick}>
                        <div className="upload-card-content">
                            <img src="/assets/icons/upload.svg"></img>
                            <p className="heading6 margin-top-8">Upload Workflow Script</p>
                            {fileContent != '' &&
                                <>
                                    <p className="subHeading2 selected-files">File: {fileInfo.name}</p>
                                    <p className="subHeading2 selected-files">Size: {fileInfo.size}</p>
                                </>
                            }
                        </div>
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
                    {
                        !isNewTask &&
                        <DropdownComponent
                            selectedItemIndex={selectedUpdateTypeIndex}
                            onChangeCallback={(selectedIndex) => {
                                setSelectedUpdateTypeIndex(selectedIndex)
                            }}
                            itemList={updateTypes}
                            customClass={"model-upload-custom-dropdown"}
                        ></DropdownComponent>
                    }
                    {
                        isNewTask &&
                        <input
                            type="text"
                            className="model-upload-custom-dropdown"
                            placeholder={"Name"}
                            value={DEFAULT_TASK_NAME}
                            readOnly
                        />
                    }
                    <input
                        type="text"
                        className="model-upload-custom-dropdown"
                        placeholder={"Description"}
                        value={description}
                        onChange={handleDescriptionChange}
                    />
                    <div className="tagsBtn" onClick={() => setCurrentView(upadteTaskView.CT_SELECTION_VIEW)}>Configure Deployment Tags</div>
                </div>
                <button className={`uploadBtn ${description == '' || fileContent == '' ? 'disabledBtn' : ''}`} onClick={handleSubmit}>Update</button>
            </div>
            }
            {
                currentView == upadteTaskView.CT_SELECTION_VIEW && 
                <div>
                    <UploadModelCTSelection allTagsDetailsList={allTagsList} preSelectedTagsList={selectedDeploymentTags} handleTagSelection={handleTagSelection} setCurrentView={setCurrentView} />
                </div>
            }
    </>
  );
}

export default TaskUpdate;

const UploadModelCTSelection = ({allTagsDetailsList, preSelectedTagsList = [], handleTagSelection, setCurrentView}) => {
    const allTagsList = allTagsDetailsList.map(tag => {return {title: tag.name}});
    
    return (
        <div>
            <img className={"backArrow-modelUpload-tagSelection"} src={"/assets/icons/backArrow.svg"} onClick={() => setCurrentView(upadteTaskView.UPDATE_TASK_VIEW)}></img>
            <SelectableCardsList cards={allTagsList} selectedCards={preSelectedTagsList} handleCardClick={handleTagSelection} />
        </div>
    )
}