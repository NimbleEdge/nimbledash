import { fetchDeploymentTagDetails, fetchDeploymentTags, fetchModelList } from "data/apis";
import '../../../common.css';
import './admin_page.css';
import React, { useEffect, useState } from "react";
import ToggleButton from "presentation/components/toggleButton/toggleButton";
import ModelsTable from "./modelsTable/modelsTable";
import TagsTable from "./tagsTable/tagsTable";
import ModelDetailsTable from "./modelDetailsTable/modelDetailsTable";
import ModelUpload from "./ModelUpload/modelUpload";

const AdmninPageView = { 
    MODELS_TABLE: 'modelsTable', 
    DEPLOYMENT_TAGS_TABLE: 'deploymentTagsTable', 
    MODEL_VERSIONS_TABLE: 'modelVersionsTable'
}; 

function getBiggerVersions(version1, version2) {
    const v1 = version1.split('.').map(Number);
    const v2 = version2.split('.').map(Number);

    const maxLength = Math.max(v1.length, v2.length);

    for(let idx = 0; idx < maxLength; idx++) {
        const num1 = idx < v1.length ? v1[idx] : 0;
        const num2 = idx < v2.length ? v2[idx] : 0;

        if (num1 > num2) {
            return version1;
          } else if (num1 < num2) {
            return version2;
          }
    }

    return version1;  
}

const AdminPage = () => {
    const [currentView, setView] = useState(AdmninPageView.DEPLOYMENT_TAGS_TABLE);
    const [tagsList, updateTagsList] = useState([]);
    const [modelsList, udpateModelsList] = useState([]);
    const [tagsDetails, updateTagsDetails] = useState({});
    const [modelsDetails, updateModelsDetails] = useState({});
    const [selectedModelName, setSelectedModelName] = useState(null);

    useEffect(() => {
        fetchModelList(udpateModelsList);
        fetchDeploymentTags(updateTagsList);
    }, []);

    useEffect(() => {
        const fetchAllTagsDetails = async () => {
            const promises = tagsList.map((tag) => fetchDeploymentTagDetails(tag));
            const results = await Promise.all(promises);
            results.forEach((data) => {
                tagsDetails[data.name] = {description: data.description, models: data.modelVersions};
            });
            updateTagsDetails({...tagsDetails});
        }
        fetchAllTagsDetails();
    }, [tagsList]);

    const updateModelDetails = () => {
        // adding model, model versions, latest version
        modelsList.forEach((model, index) => {
            const modelName = model.modelName;
            const modelVersion = model.modelVersion;
            if(!(modelName in modelsDetails)) {
                modelsDetails[modelName] = {latestVersion: modelVersion, tags: {}, versionToTags: {}, versions: {}};
                modelsDetails[modelName]['versions'][model.modelVersion] = true;
            } else {
                modelsDetails[modelName]['versions'][model.modelVersion] = true;
                modelsDetails[modelName]['latestVersion'] = getBiggerVersions(modelVersion, modelsDetails[modelName].latestVersion);
            }
        });

        // adding tags and version wise tags
        for(const tag in tagsDetails) {
            for(const modelName in tagsDetails[tag]['models']) {
                if(modelsDetails[modelName] == undefined) console.log(modelName, tag);
                modelsDetails[modelName]['tags'][tag] = true;
                tagsDetails[tag]['models'][modelName].forEach(version => {
                    if(!(version in modelsDetails[modelName]['versionToTags'])) {
                        modelsDetails[modelName]['versionToTags'][version] = {};
                    }
                    modelsDetails[modelName]['versionToTags'][version][tag] = true;
                })
            }
        }
        updateModelsDetails({...modelsDetails});
    }

    useEffect(() => {
        updateModelDetails();
    }, [modelsList, tagsDetails]);

    const toggleView = () => {
        if(currentView == AdmninPageView.MODELS_TABLE) {
            setView(AdmninPageView.DEPLOYMENT_TAGS_TABLE);
        } else if (currentView == AdmninPageView.DEPLOYMENT_TAGS_TABLE) {
            setView(AdmninPageView.MODELS_TABLE);
        }
    }

    const onModelClick = (model) => {
        setView(AdmninPageView.MODEL_VERSIONS_TABLE);
        setSelectedModelName(model);
    }

    const clickBack = () => {
        setView(AdmninPageView.MODELS_TABLE);
        setSelectedModelName(null);
    }

    return (
        <div className={`flexColumn adminPage`}>
            <div className={`flexColumn adminPageHeader`}>
                <div className={`adminPageTitle`}>Admin Panel</div>
                <div className={`adminPageSubtitle`}>Perform CRUD Operations</div>
            </div>
            <div className={`adminPageContent`}>
                {
                    currentView == AdmninPageView.MODEL_VERSIONS_TABLE ? 
                    <div className="modelDetailsBackButton">
                        <img className={"back-arrow-model-details-table"} src={"/assets/icons/backArrow.svg"} onClick={clickBack}></img>
                        <div className={`selectedModelName`}>{selectedModelName}</div>
                    </div> 
                    :
                    <div className={`subHeader flexRow`}>
                        <div className={`subHeaderText`}>Correlations</div>
                        {currentView != AdmninPageView.MODEL_VERSIONS_TABLE && <ToggleButton option1={'Compatability Tags'} option2={'Models'} handleToggle={toggleView} selectedOption={currentView == AdmninPageView.MODELS_TABLE ? 'Models' : 'Compatability Tags'} />}
                    </div>
                }
                {currentView == AdmninPageView.MODELS_TABLE && <ModelsTable modelsDetails={modelsDetails} onModelClick={onModelClick} allTagsList={tagsList} />}
                {currentView == AdmninPageView.DEPLOYMENT_TAGS_TABLE && <TagsTable tagsDetails={tagsDetails} modelsDetails={{...modelsDetails}} updateTagsList={updateTagsList} />}
                {currentView == AdmninPageView.MODEL_VERSIONS_TABLE && <ModelDetailsTable modelDetails={{...modelsDetails[selectedModelName]}} modelName={selectedModelName} allTagsList={[...tagsList]} updateTagsList={updateTagsList} />}
            </div>
        </div>
    )
}

export default AdminPage;