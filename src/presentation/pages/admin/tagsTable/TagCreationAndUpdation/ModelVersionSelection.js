import '../../../../../common.css';
import '../../admin_page.css';
import './TagCreationAndUpdation.css';
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const ModelVersionSelection = ({modelName, modelDetails, preSelectedVersions, onClickBack, handleSave}) => {
    let modelVersions = [];
    for(const version in modelDetails['versions']) {
        modelVersions.push(version);
    }
    const [selectedVersions, setSelectedVersions] = useState(preSelectedVersions);
    const handleVersionClick = (version) => {
        setSelectedVersions(prevSelectedVersions => {
            if (version in prevSelectedVersions) {
                if(prevSelectedVersions[version]['preAttached'] == true) {
                    toast.error("Pre-attached versions cannot be removed", {
                        toastId: "errorToast",
                    });
                    return prevSelectedVersions;
                } else {
                    delete prevSelectedVersions[version];
                    return {...prevSelectedVersions};
                }
            } else {
                return {...prevSelectedVersions, [version]: {'preAttached': false}};
            }
        });
    }

    return (
        <>
            <div className="create-new-tag-model-version-selection-header">
                <img className={"backArrow"} src={"/assets/icons/backArrow.svg"} onClick={onClickBack}></img>
                <div className={"modal-save-icon"} onClick={(e) => handleSave(modelName, selectedVersions)}>
                  <img className={"saveTick"} src={"/assets/icons/saveTick.svg"}></img>
                </div>
                <div className="create-new-tag-version-selection-title">Create A New Compatability Tag &gt; {modelName}</div>
                {/* <button onClick={(e) => handleSave(modelName, selectedVersions)} className="newTag-modelVersion-selection-button">Update Selection</button> */}
                {/* <img className={"create-new-tag-saveIcon"} src={"/assets/icons/saveIcon.svg"} onClick={(e) => handleSave(modelName, selectedVersions)}></img> */}
            </div>
            <div className="create-new-tag-model-version-selection">
                {modelVersions.map((version) => (
                    <div key={version} className={`version-box ${(version in selectedVersions) ? 'selected-version-box' : 'not-selected-version-box'}`} onClick={(e) => handleVersionClick(version)}>
                        <div className={`version-text ${(version in selectedVersions) ? 'selected-version-text' : 'not-selected-version-text'}`}>{'v' + version}</div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default ModelVersionSelection;