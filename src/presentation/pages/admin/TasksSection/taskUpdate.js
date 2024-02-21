import React, { useRef, useState } from "react";
import "../admin_page.css";
import { toast } from "react-toastify";
import { createNewTask, updateTask } from "data/apis";
import "./taskUpdate.css";
import { SelectableCardsList } from "presentation/components/RectangularCards/rectangularCards";
import { DEFAULT_TASK_NAME } from "../new_admin_page";
import { useDispatch } from "react-redux";
import { RectCard } from "presentation/components/RectangularCards/card";
import Search, { ITEMS_LAYOUT } from "presentation/components/Search/searchComponent";

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

    const tagSelectionToggle = (card) => {
        setSelectedDeploymentTags(prevSelectedTags => {
            if (prevSelectedTags.includes(card.title)) {
                 return prevSelectedTags.filter(selectedTag => selectedTag !== card.title);
            } else {
                return [...prevSelectedTags, card.title];
            }
        });
    }

    const addTags = (tags) => {
        setSelectedDeploymentTags(prevTags => {
            const updatedTags = [...prevTags];
            tags.forEach(tag => {
                if(!prevTags.includes(tag)) updatedTags.push(tag);
            })
            return updatedTags;
        })
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
                    <input type="file" accept=".py" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
                    {
                        // !isNewTask &&
                        // <DropdownComponent
                        //     selectedItemIndex={selectedUpdateTypeIndex}
                        //     onChangeCallback={(selectedIndex) => {
                        //         setSelectedUpdateTypeIndex(selectedIndex)
                        //     }}
                        //     itemList={updateTypes}
                        //     customClass={"model-upload-custom-dropdown"}
                        // ></DropdownComponent>
                    }
                    {/* {
                        isNewTask &&
                        <input
                            type="text"
                            className="model-upload-custom-dropdown"
                            placeholder={"Name"}
                            value={DEFAULT_TASK_NAME}
                            readOnly
                        />
                    } */}
                    <input
                        type="text"
                        className="task-update-description"
                        placeholder={"Description"}
                        value={description}
                        onChange={handleDescriptionChange}
                        maxLength={100}
                    />
                    <div className="tagsBtn" onClick={() => setCurrentView(upadteTaskView.CT_SELECTION_VIEW)}>
                        {selectedDeploymentTags.length == 0 ? "Configure Compatability Tags" : selectedDeploymentTags.map((tag, index) => {
                            if(index == selectedDeploymentTags.length - 1) return tag;
                            else return tag + ", ";
                         })}
                    </div>
                </div>
                <button className={`uploadBtn ${description == '' || fileContent == '' ? 'disabledBtn' : ''}`} onClick={handleSubmit}>Update</button>
            </div>
            }
            {
                currentView == upadteTaskView.CT_SELECTION_VIEW && 
                <div>
                    <TagSelection allTagsDetailsList={allTagsList} preSelectedTagsList={selectedDeploymentTags} saveSelectedTags={setSelectedDeploymentTags} setCurrentView={setCurrentView} />
                </div>
            }
    </>
  );
}

export default TaskUpdate;

const TagSelection = ({allTagsDetailsList, preSelectedTagsList = [], saveSelectedTags, setCurrentView}) => {
    const [selectedTags, setSelectedTags] = useState(preSelectedTagsList);
    const tagsSearchList = [];
    allTagsDetailsList.forEach(tag => {
        if(!selectedTags.includes(tag.name)) {
            tagsSearchList.push({searchText: tag.name});
        }
    })
    const handleItemClick = (card) => {
        setSelectedTags(prevTags => {
            if(!prevTags.includes(card.title)) return [...prevTags, card.title];
            return prevTags;
        })
    }
    const handleTagRemoval = (card) => {
        setSelectedTags(prevTags => {
            return prevTags.filter(tag => tag != card.title);
        })
    }
    const handleSave = () => {
        saveSelectedTags(selectedTags);
        setCurrentView(upadteTaskView.UPDATE_TASK_VIEW);
    }
    return (
        <div className={'tag-selection-container'}>
            <div className={"modal-save-icon"} onClick={handleSave}>
                  <img className={"saveTick"} src={"/assets/icons/saveTick.svg"}></img>
            </div>
            <img className={"backArrow-modelUpload-tagSelection"} src={"/assets/icons/backArrow.svg"} onClick={() => setCurrentView(upadteTaskView.UPDATE_TASK_VIEW)}></img>
            <Search searchList={tagsSearchList} handleItemClick={handleItemClick} placeholder="Search Tags" />
            <div className="selected-tags-list-container">
                <div className="selected-tags-list-header">Selected Tags</div>
                <div className="selected-tags-list">
                    {selectedTags.map(tag =>
                        <RectCard card={{title: tag}} hasRemoveButton handleRemove={handleTagRemoval} customStyle={{box: {marginRight: '15px'}}}/>
                    )}
                </div>
            </div>
        </div>
    )
}