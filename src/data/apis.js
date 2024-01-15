import {
    ACCESS_TOKEN,
    APP_BASE_MDS_URL,
    CLIENT_ID,
    COGNITO_USERNAME,
    USER_EMAIL,
  } from "core/constants";
import { getAuthMethod } from "core/utils";
import axios from "axios";
import { toast } from "react-toastify";
import { loaderActions } from "presentation/redux/stores/store";

export const createDeploymentTag = async ({tagName, tagDescription, models, updateTagsList}) => {
  console.log(models);
  await axios
    .post(`${APP_BASE_MDS_URL}api/v1/admin/deployment`,
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
      const reponse  = await axios
        .get(`${APP_BASE_MDS_URL}/api/v1/admin/deployments/${tag.name}`, {
          headers: {
            AuthMethod: getAuthMethod(),
            Token: localStorage.getItem(ACCESS_TOKEN),
            ClientId: localStorage.getItem(CLIENT_ID),
            TokenId: localStorage.getItem(USER_EMAIL),
            CognitoUsername: localStorage.getItem(COGNITO_USERNAME),
          },
        });
      return reponse.data;
    } catch (error) {
      console.log(error);
      return null;
    }
};

export const fetchModelList = async (setModelList, dispatch) => {
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
        var listOfModels = res.data.models;
        setModelList(listOfModels);
      })
      .catch((e) => {
        //console.log(e);
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
      if(dispatch) dispatch(loaderActions.toggleLoader(false));
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
        //console.log(e);
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