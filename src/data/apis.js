import {
  ACCESS_TOKEN,
  APP_BASE_DMS_URL,
  APP_BASE_MDS_URL,
  AUTH_METHOD,
  CLIENT_ID,
  COGNITO_USERNAME,
  FORM_PASSWORD,
  FORM_USERNAME,
  USER_EMAIL,
} from "core/constants";
import axios from "axios";
import { toast } from "react-toastify";
import store, { loaderActions } from "presentation/redux/stores/store";
import { DEFAULT_TASK_NAME } from "presentation/pages/admin/new_admin_page";
import { getRequest, postRequest, putRequest } from "./remote_datasource";

export const fetchTaskFile = async ({ taskVersion }) => {
  var res = await getRequest(APP_BASE_MDS_URL, `api/v2/admin/tasks/${DEFAULT_TASK_NAME}/versions/${taskVersion}`)
  return res;
};

function getCurrentISODateTime() {
  const now = new Date();
  return now.toISOString();
}

function getOneWeekAgoISODateTime() {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // Subtracting milliseconds for one week
  return oneWeekAgo.toISOString();
}

export const fetchActiveUsers = async (modelName, version) => {
  const clientID = store.getState().userReducer.clientID;
  const startDate = getCurrentISODateTime();
  const endDate = getOneWeekAgoISODateTime();
  var res = await getRequest(APP_BASE_DMS_URL, `/dms/api/v1/metrics/clients/${clientID}/models/${modelName}/versions/${version}/inference?startTime=${startDate}&endTime=${endDate}`);
  return res.data;
}

export const updateDeploymentTag = async ({
  tagName,
  tagDescription,
  models,
  updateTagsList,
}) => {
  await postRequest(APP_BASE_MDS_URL, 'api/v2/admin/compatibilityTag', {
    name: tagName,
    description: tagDescription,
  },);

  fetchDeploymentTags(updateTagsList);
  toast.success("Update Successful");
}

export const createDeploymentTag = async ({
  tagName,
  tagDescription,
  models,
  updateTagsList,
}) => {
  await updateDeploymentTag({ tagName: tagName, tagDescription: tagDescription, models: models, updateTagsList: updateTagsList });
};

export const fetchDeploymentTags = async (updateTagsList) => {
  var res = await getRequest(APP_BASE_MDS_URL, 'api/v2/admin/compatibilityTags');
  const tags = res.data.tags;
  updateTagsList([...tags]);
};

export const fetchDeploymentTagDetails = async (tag) => {
  var res = await getRequest(APP_BASE_MDS_URL, `api/v2/admin/compatibilityTags/${tag.name}`);
  return res.data;
};

export const fetchModelList = async ({ successCallback, dispatch = null }) => {
  var res = await getRequest(APP_BASE_MDS_URL, "api/v2/admin/models");
  let listOfModels = res.data.models;
  successCallback(listOfModels);
};

export const addDeploymentTags = async (
  modelName,
  modelVersion,
  deploymentTags,
  description,
  updateTagsList
) => {

  await putRequest(APP_BASE_MDS_URL, 'api/v2/admin/model', {
    modelName: modelName,
    modelVersion: modelVersion,
    deploymentTags: deploymentTags,
    description: description,
  });

  toast.success("Tags added successfully");
  fetchDeploymentTags(updateTagsList);
};

export const fetchTasksList = async (
  updateTasksList,
  dispatch = null,
  successToast = null
) => {
  var res = await getRequest(APP_BASE_MDS_URL, 'api/v2/admin/tasks');
  const tasksList = res.data.tasks;
  updateTasksList(tasksList);
};

export const updateTask = async ({
  taskName,
  deploymentTags,
  taskCode,
  updateType,
  description,
  onCompletion,
  updateTasksList,
  dispatch = null,
}) => {
  await postRequest(APP_BASE_MDS_URL, `api/v2/admin/taskversion`, {
    taskName: taskName,
    deploymentTags: deploymentTags,
    taskCode: taskCode,
    updateType: updateType,
    description: description,
  },);
  onCompletion();
  fetchTasksList(updateTasksList, dispatch, null);
};

export const createNewTask = async ({
  taskName,
  deploymentTags,
  taskCode,
  description,
  onCompletion,
  updateTasksList,
  dispatch = null,
}) => {
  await postRequest(APP_BASE_MDS_URL, `api/v2/admin/task`, {
    taskName: taskName,
    taskCode: taskCode,
    description: description,
  },);

  onCompletion();
  await fetchTasksList(updateTasksList, dispatch, null);
  toast.success("Script uploaded successfully")
};
