import { fetchDeploymentTagDetails, fetchDeploymentTags, fetchModelList, fetchTasksList } from "data/apis";
import '../../../common.css';
import './admin_page.css';
import React, { useEffect, useState } from "react";
import ModelsTable from "./modelsTable/modelsTable";
import TagsTable from "./tagsTable/tagsTable";
import ModelDetailsTable from "./modelDetailsTable/modelDetailsTable";
import TasksTable from "./TasksSection/tasksTable";
import Dropdown from "presentation/components/DropdownInternal/dropdown";
import { useDispatch } from "react-redux";
import { loaderActions } from "presentation/redux/stores/store";

const AdminPageView = {
    MODELS_TABLE: 'Models',
    DEPLOYMENT_TAGS_TABLE: 'Compatability Tags',
    MODEL_VERSIONS_TABLE: 'Model Versions',
    TASKS_TABLE: 'Workflow Scripts'
};

export const DEFAULT_TASK_NAME = 'DEFAULT_SCRIPT';

function getBiggerVersions(version1, version2) {
    const v1 = version1.split('.').map(Number);
    const v2 = version2.split('.').map(Number);
    const maxLength = Math.max(v1.length, v2.length);
    for (let idx = 0; idx < maxLength; idx++) {
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

const NewAdminPage = () => {
    const dispatch = useDispatch();
    const [currentView, setView] = useState(AdminPageView.DEPLOYMENT_TAGS_TABLE);
    const [tagsList, updateTagsList] = useState([]);
    const [tagsDetails, updateTagsDetails] = useState({});
    const [modelsList, updateModelsList] = useState([]);
    const [modelsDetails, updateModelsDetails] = useState({});
    const [selectedModelName, setSelectedModelName] = useState(null);
    const [tasksList, udpateTasksList] = useState([]);
    const [tasksDetails, updateTasksDetails] = useState({});
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    useEffect(() => {
        dispatch(loaderActions.toggleLoader(true));
        var count = 0;
        fetchModelList({ successCallback: (modelsList) => updateModelsList(modelsList) }).then(() => { count++; if(count == 3)  dispatch(loaderActions.toggleLoader(false));});
        fetchDeploymentTags(updateTagsList).then(() => { count++; if(count == 3)  dispatch(loaderActions.toggleLoader(false));});
        fetchTasksList(udpateTasksList).then(() => { count++; if(count == 3)  dispatch(loaderActions.toggleLoader(false));});
    }, []);

    useEffect(() => {
        fetchDeploymentTags(updateTagsList);
    }, [modelsList]);

    useEffect(() => {
        fetchDeploymentTags(updateTagsList);
    }, [tasksList]);

    useEffect(() => {
        const fetchAllTagsDetails = async () => {
            const promises = tagsList.map((tag) => fetchDeploymentTagDetails(tag));
            const results = await Promise.all(promises);
            results.forEach((data) => {
                //console.log(data);
                tagsDetails[data.name] = { description: data.description, models: data.modelVersions, tasks: data.taskVersions };
            });
            updateTagsDetails({ ...tagsDetails });
        }
        fetchAllTagsDetails();
    }, [tagsList]);

    const updateModelDetails = (modelsList, tasksList) => {
        // adding model, model versions, latest version
        const updatedModelsDetails = {};
        modelsList.forEach((model, index) => {
            //console.log(model);
            const modelName = model.modelName;
            const modelVersion = model.modelVersion;
            if (!(modelName in updatedModelsDetails)) {
                updatedModelsDetails[modelName] = { latestVersion: modelVersion, tags: {}, versionToTags: {}, versions: {} };
                updatedModelsDetails[modelName]['versions'][model.modelVersion] = true;
            } else {
                updatedModelsDetails[modelName]['versions'][model.modelVersion] = true;
                updatedModelsDetails[modelName]['latestVersion'] = getBiggerVersions(modelVersion, updatedModelsDetails[modelName].latestVersion);
            }
            updatedModelsDetails[modelName]['versionToTags'][modelVersion] = {};
        });

        // adding task, tasks versions, latest version
        const updatedTasksDetails = {};
        tasksList.forEach((task, index) => {
            const taskName = task.name;
            const taskVersion = task.version;
            const taskDescription = task.description;
            if (!(taskName in updatedTasksDetails)) {
                updatedTasksDetails[taskName] = { latestVersion: taskVersion, tags: {}, versionToTags: {}, versions: {} };
                updatedTasksDetails[taskName]['versions'][taskVersion] = { description: taskDescription };
            } else {
                updatedTasksDetails[taskName]['versions'][taskVersion] = { description: taskDescription };
                updatedTasksDetails[taskName]['latestVersion'] = getBiggerVersions(taskVersion, updatedTasksDetails[taskName].latestVersion);
            }
            updatedTasksDetails[taskName]['versionToTags'][taskVersion] = {};
        });

        // adding tags and version wise tags
        for (const tag in tagsDetails) {
            for (const modelName in tagsDetails[tag]['models']) {
                if (updatedModelsDetails[modelName] == undefined) continue;
                updatedModelsDetails[modelName]['tags'][tag] = true;
                tagsDetails[tag]['models'][modelName].forEach(version => {
                    if (!(version in updatedModelsDetails[modelName]['versionToTags'])) {
                        updatedModelsDetails[modelName]['versionToTags'][version] = {};
                    }
                    updatedModelsDetails[modelName]['versionToTags'][version][tag] = true;
                })
            }
            //console.log(tagsDetails);
            // for(const taskName in tagsDetails[tag]['tasks']) {
            //     if(updatedTasksDetails[taskName] == undefined) continue;
            //     updatedTasksDetails[taskName]['tags'][tag] = true;
            //     tagsDetails[tag]['tasks'][taskName].forEach(version => {
            //         if(!(version in updatedTasksDetails[taskName]['versionToTags'])) {
            //             updatedTasksDetails[taskName]['versionToTags'][version] = {};
            //         }
            //         updatedTasksDetails[taskName]['versionToTags'][version][tag] = true;
            //     })
            // }
        }
        updateModelsDetails({ ...updatedModelsDetails });
        updateTasksDetails({ ...updatedTasksDetails });
    }

    useEffect(() => {
        updateModelDetails(modelsList, tasksList);
    }, [tagsDetails]);

    const onModelClick = (model) => {
        setView(AdminPageView.MODEL_VERSIONS_TABLE);
        setSelectedModelName(model);
    }

    const clickBack = () => {
        setView(AdminPageView.MODELS_TABLE);
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
                    currentView == AdminPageView.MODEL_VERSIONS_TABLE ?
                        <div className="modelDetailsBackButton">
                            <img className={"back-arrow-model-details-table"} src={"/assets/icons/backArrow.svg"} onClick={clickBack}></img>
                            <div className={`selectedModelName`}>{selectedModelName}</div>
                        </div>
                        :
                        <div className={`subHeader flexRow`}>
                            <div className={`subHeaderText`}>Correlations</div>
                            {/* {currentView != AdminPageView.MODEL_VERSIONS_TABLE && <MultipleOptionsButton options={[AdminPageView.DEPLOYMENT_TAGS_TABLE, AdminPageView.TASKS_TABLE, AdminPageView.MODELS_TABLE]} handleSelection={(view) => setView(view)} selectedOption={currentView} />} */}
                            {currentView != AdminPageView.MODEL_VERSIONS_TABLE &&
                                <div className="subHeaderActions">
                                    <Dropdown options={[AdminPageView.DEPLOYMENT_TAGS_TABLE, AdminPageView.TASKS_TABLE, AdminPageView.MODELS_TABLE]} handleSelection={(view) => setView(view)} defaultSelectedOption={currentView} />
                                    <div className="new-admin-page-upload-btn cursorPointer" onClick={() => setIsUploadModalOpen(true)}>
                                        {currentView != AdminPageView.DEPLOYMENT_TAGS_TABLE && <img src={"/assets/icons/upload2.svg"} className={``} />}
                                        {currentView == AdminPageView.DEPLOYMENT_TAGS_TABLE && <img src={"/assets/icons/CreatePlus.svg"} className={``} />}
                                    </div>
                                </div>
                            }
                        </div>
                }
                {currentView == AdminPageView.MODELS_TABLE && <ModelsTable modelsDetails={modelsDetails} onModelClick={onModelClick} allTagsList={tagsList} updateModelsList={updateModelsList} isUploadNewModelModalOpen={isUploadModalOpen} setIsUploadNewModelModalOpen={setIsUploadModalOpen} />}
                {currentView == AdminPageView.TASKS_TABLE && <TasksTable tasksDetails={tasksDetails} allTagsList={tagsList} updateTasksList={udpateTasksList} isUpdateTaskModalOpen={isUploadModalOpen} setIsUpdateTaskModalOpen={setIsUploadModalOpen} />}
                {currentView == AdminPageView.DEPLOYMENT_TAGS_TABLE && <TagsTable tagsDetails={tagsDetails} modelsDetails={{ ...modelsDetails }} tasksDetails={{ ...tasksDetails }} updateTagsList={updateTagsList} isCreateNewTagModalOpen={isUploadModalOpen} setIsCreateNewTagModalOpen={setIsUploadModalOpen} />}
                {currentView == AdminPageView.MODEL_VERSIONS_TABLE && <ModelDetailsTable modelDetails={{ ...modelsDetails[selectedModelName] }} modelName={selectedModelName} allTagsList={[...tagsList]} updateTagsList={updateTagsList} />}
            </div>
        </div>
    )
}

export default NewAdminPage;