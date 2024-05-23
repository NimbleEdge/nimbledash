import { CodeiumEditor } from "@codeium/react-code-editor";
import { createNewTask, updateTask } from "data/apis";
import { loaderActions } from "presentation/redux/stores/store";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

export const CodeEditor = (props) => {
    var onClose = props.onClose;
    var code = props.code;
    var updateTasksList = props.updateTasksList;

    const [isDescriptionBoxVisible, setIsDescriptionBoxVisible] = useState(false);
    const [description, setDescription] = useState("");
    const [newCode, setNewCode] = useState("");
    const dispatch = useDispatch();
    
    const handleUpload = async () => {
        dispatch(loaderActions.toggleLoader(true));
        await updateTask({
            taskName: "DEFAULT_SCRIPT",
            deploymentTags: null,
            taskCode: newCode,
            updateType:1,
            description: description,
            onCompletion: ()=>{},
            updateTasksList: updateTasksList,
            dispatch: null
        });
        onClose();
        toast.success("Script updated successfully!");
        dispatch(loaderActions.toggleLoader(false));
    }

    return (
        <div>
            <div className="translucent-bg"></div>
            <div className="codeEditorWindow">
                {isDescriptionBoxVisible && <div className="description-update" >
                    <input placeholder="Enter description " className="description-input" type="text"
                        onChange={(e) => setDescription(e.target.value)}
                    ></input>
                    <div className="accept-button" onClick={handleUpload}>
                        <img src="/assets/icons/saveTick.svg" className="action-icon absolute-center"></img>
                    </div>
                    <div className="reject-button" onClick={() => { setIsDescriptionBoxVisible(false); }}>
                        <img src="/assets/icons/close.svg" className="action-icon absolute-center"></img>
                    </div>
                    <div></div>
                </div>}

                {!isDescriptionBoxVisible && <div className="updateScriptButton flex" onClick={() => { setIsDescriptionBoxVisible(true); }}>
                    <img src="/assets/icons/saveTick.svg" className="action-icon"></img>
                    <p className="buttonText">Upload as a new script</p>
                </div>}

                <img className="codeEditorCloseButton" src="/assets/icons/close.svg" onClick={onClose}></img>
                <CodeiumEditor onChange={(newCode) => { setNewCode(newCode); }} height={"80vh"} width={"80vw"} value={code} language="python" theme="vs-dark" />
            </div>
        </div>
    );
};

