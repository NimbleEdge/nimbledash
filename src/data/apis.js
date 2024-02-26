import {
    ACCESS_TOKEN,
    APP_BASE_MDS_URL,
    CLIENT_ID,
    COGNITO_USERNAME,
    USER_EMAIL,
  } from "core/constants";
import axios from "axios";
import { toast } from "react-toastify";
import { loaderActions } from "presentation/redux/stores/store";
import { getAuthMethod } from "core/utils";

export const fetchClientIDList = async (clientID, setClientIDList) => {
    await axios
      .get(`${APP_BASE_MDS_URL}/mds/api/v1/admin/user/clients`, {
          headers: {
              AuthMethod: getAuthMethod(),
              Token: localStorage.getItem(ACCESS_TOKEN),
              ClientId: clientID,
              TokenId: localStorage.getItem(USER_EMAIL),
              CognitoUsername: localStorage.getItem(COGNITO_USERNAME),
          },
      })
      .then((res) => {
          if (res.status == 200) {
              setClientIDList(res.data.Clients);
          } else {
              toast.error("Can't fetch client ids", {
                  toastId: "errorToast",
              });
          }
      })
      .catch((e) => {
          const errorDescription = e.response?.data?.error?.description;
          if (errorDescription != null) {
              toast.error(errorDescription, {
                  toastId: "errorToast",
              });
          } else {
              toast.error("Something Went Wrong.", {
                toastId: "errorToast",
              });
          }
      });
};


export const fetchModelList = async ({successCallback, dispatch = null}) => {
    if(dispatch) dispatch(loaderActions.toggleLoader(true));

    await axios
      .get(`${APP_BASE_MDS_URL}/mds/api/v1/admin/models`, {
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
        successCallback(listOfModels);
        if(dispatch) dispatch(loaderActions.toggleLoader(false));
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