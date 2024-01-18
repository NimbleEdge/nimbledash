import {
    ACCESS_TOKEN,
    APP_BASE_DMS_URL,
    APP_BASE_MDS_URL,
    CLIENT_ID,
    COGNITO_USERNAME,
    USER_EMAIL,
  } from "core/constants";
import { getAuthMethod } from "core/utils";
import axios from "axios";
import { toast } from "react-toastify";
import { loaderActions } from "presentation/redux/stores/store";

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
  try{
    const clientID = localStorage.getItem(CLIENT_ID);
    const startDate = getCurrentISODateTime();
    const endDate = getOneWeekAgoISODateTime();
    const response  = await axios
      .get(`${APP_BASE_DMS_URL}/dms/api/v1/metrics/clients/${clientID}/models/${modelName}/versions/${version}/inference?startTime=${startDate}&endTime=${endDate}`, {
        headers: {
          AuthMethod: getAuthMethod(),
          Token: localStorage.getItem(ACCESS_TOKEN),
          ClientId: localStorage.getItem(CLIENT_ID),
          TokenId: localStorage.getItem(USER_EMAIL),
          CognitoUsername: localStorage.getItem(COGNITO_USERNAME),
        },
      });
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export const createDeploymentTag = async ({tagName, tagDescription, models, updateTagsList}) => {
  await axios
    .post(`${APP_BASE_MDS_URL}/api/v1/admin/deployment`,
    {
      name: tagName,
      description: tagDescription,
      modelVersions: models
    },
    {
      headers: {
        AuthMethod: getAuthMethod(),
        Token: localStorage.getItem(ACCESS_TOKEN),
        ClientId: localStorage.getItem(CLIENT_ID),
        TokenId: localStorage.getItem(USER_EMAIL),
        CognitoUsername: localStorage.getItem(COGNITO_USERNAME),
      },
    })
    .then((res) => {
      toast.success("Tag created successfully");
      fetchDeploymentTags(updateTagsList);
    })
    .catch((e) => {
      console.log(e);
    });
};

export const fetchDeploymentTags = async (updateTagsList) => {
    await axios
      .get(`${APP_BASE_MDS_URL}/api/v1/admin/deployments`, {
        headers: {
          AuthMethod: getAuthMethod(),
          Token: localStorage.getItem(ACCESS_TOKEN),
          ClientId: localStorage.getItem(CLIENT_ID),
          TokenId: localStorage.getItem(USER_EMAIL),
          CognitoUsername: localStorage.getItem(COGNITO_USERNAME),
        },
      })
      .then((res) => {
        const tags = res.data.tags;
        updateTagsList([...tags]);
      })
      .catch((e) => {
        console.log(e);
      });
};

export const fetchDeploymentTagDetails = async (tag) => {
    try{
      const response  = await axios
        .get(`${APP_BASE_MDS_URL}/api/v1/admin/deployments/${tag.name}`, {
          headers: {
            AuthMethod: getAuthMethod(),
            Token: localStorage.getItem(ACCESS_TOKEN),
            ClientId: localStorage.getItem(CLIENT_ID),
            TokenId: localStorage.getItem(USER_EMAIL),
            CognitoUsername: localStorage.getItem(COGNITO_USERNAME),
          },
        });
      return response.data;
    } catch (error) {
      console.log(error);
      return null;
    }
};

export const fetchModelList = async ({updateModelsList, dispatch = null, closeModal = null, successToast = null}) => {
    if(dispatch) dispatch(loaderActions.toggleLoader(true));

    await axios
      .get(`${APP_BASE_MDS_URL}/api/v1/admin/models`, {
        headers: {
          AuthMethod: getAuthMethod(),
          Token: localStorage.getItem(ACCESS_TOKEN),
          ClientId: localStorage.getItem(CLIENT_ID),
          TokenId: localStorage.getItem(USER_EMAIL),
          CognitoUsername: localStorage.getItem(COGNITO_USERNAME),
        },
      })
      .then((res) => {
        let listOfModels = res.data.models;
        updateModelsList(listOfModels);
        if(closeModal) closeModal();
        if(dispatch) dispatch(loaderActions.toggleLoader(false));
        if(successToast) toast.success(successToast.message);
      })
      .catch((e) => {
        if(dispatch) dispatch(loaderActions.toggleLoader(false));
        var errorDescription = e.response.data?.error?.description;
        if (errorDescription != null)
          toast.error(errorDescription, {
            toastId: "errorToast",
          });
        else
          toast.error("Something Went Wrong.", {
            toastId: "errorToast",
          });
      });
};

export const addDeploymentTags = async (modelName, modelVersion, deploymentTags, description, updateTagsList) => {
  await axios
      .put(
        `${APP_BASE_MDS_URL}/api/v1/admin/model`,
        {
          modelName: modelName,
          modelVersion: modelVersion,
          deploymentTags: deploymentTags,
          description: description,
        },
        {
          headers: {
            AuthMethod: getAuthMethod(),
            Token: localStorage.getItem(ACCESS_TOKEN),
            ClientId: localStorage.getItem(CLIENT_ID),
            TokenId: localStorage.getItem(USER_EMAIL),
            CognitoUsername: localStorage.getItem(COGNITO_USERNAME),
          },
        }
      )
      .then((res) => {
        toast.success("Tags added successfully");
        fetchDeploymentTags(updateTagsList);
      })
      .catch((e) => {
        var errorDescription = e.response.data?.error?.description;
        if (errorDescription != null)
          toast.error(errorDescription, {
            toastId: "errorToast",
          });
        else
          toast.error("Something Went Wrong.", {
            toastId: "errorToast",
          });
      });
}

export const fetchTasksList = async (updateTasksList, dispatch = null, successToast = null) => {
  if(dispatch) dispatch(loaderActions.toggleLoader(true));
  await axios
    .get(`${APP_BASE_MDS_URL}/api/v1/admin/tasks`, {
      headers: {
        AuthMethod: getAuthMethod(),
        Token: localStorage.getItem(ACCESS_TOKEN),
        ClientId: localStorage.getItem(CLIENT_ID),
        TokenId: localStorage.getItem(USER_EMAIL),
        CognitoUsername: localStorage.getItem(COGNITO_USERNAME),
      },
    })
    .then((res) => {
      const tasksList = res.data.tasks;
      updateTasksList(tasksList);
      if(dispatch) dispatch(loaderActions.toggleLoader(false));
      if(successToast) toast.success(successToast.message);
    })
    .catch((e) => {
      if(dispatch) dispatch(loaderActions.toggleLoader(true));
      console.log(e);
    });
};

export const updateTask = async ({taskName, deploymentTags, taskCode, updateType, description, onCompletion, updateTasksList, dispatch = null}) => {
  if(dispatch) dispatch(loaderActions.toggleLoader(true));
  await axios
      .post(
        `${APP_BASE_MDS_URL}/api/v1/admin/taskversion`,
        {
          taskName: taskName,
          deploymentTags: deploymentTags,
          taskCode: taskCode,
          updateType: updateType,
          description: description
        },
        {
          headers: {
            AuthMethod: getAuthMethod(),
            Token: localStorage.getItem(ACCESS_TOKEN),
            ClientId: localStorage.getItem(CLIENT_ID),
            TokenId: localStorage.getItem(USER_EMAIL),
            CognitoUsername: localStorage.getItem(COGNITO_USERNAME),
          },
        }
      )
      .then((res) => {
        const successToast = {message: "Script updated successfully"};
        onCompletion();
        fetchTasksList(updateTasksList, dispatch, successToast);
      })
      .catch((e) => {
        if(dispatch) dispatch(loaderActions.toggleLoader(false));
        var errorDescription = e.response.data?.error?.description;
        if (errorDescription != null)
          toast.error(errorDescription, {
            toastId: "errorToast",
          });
        else
          toast.error("Something Went Wrong.", {
            toastId: "errorToast",
          });
      });
}

export const createNewTask = async ({taskName, deploymentTags, taskCode, description, onCompletion, updateTasksList, dispatch = null}) => {
  if(dispatch) dispatch(loaderActions.toggleLoader(true));
  await axios
      .post(
        `${APP_BASE_MDS_URL}/api/v1/admin/task`,
        {
          taskName: taskName,
          deploymentTags: deploymentTags,
          taskCode: taskCode,
          description: description
        },
        {
          headers: {
            AuthMethod: getAuthMethod(),
            Token: localStorage.getItem(ACCESS_TOKEN),
            ClientId: localStorage.getItem(CLIENT_ID),
            TokenId: localStorage.getItem(USER_EMAIL),
            CognitoUsername: localStorage.getItem(COGNITO_USERNAME),
          },
        }
      )
      .then((res) => {
        const successToast = {message: "Script uploaded successfully"};
        onCompletion();
        fetchTasksList(updateTasksList, dispatch, successToast);
      })
      .catch((e) => {
        if(dispatch) dispatch(loaderActions.toggleLoader(false));
        var errorDescription = e.response.data?.error?.description;
        if (errorDescription != null)
          toast.error(errorDescription, {
            toastId: "errorToast",
          });
        else
          toast.error("Something Went Wrong.", {
            toastId: "errorToast",
          });
      });
}