import axios from "axios";
import store from "presentation/redux/stores/store";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export async function postRequest(URI, endpoint, body, headers) {

  if(headers == null){
    headers = fetchHeaders();
  }
  try {
    var response = await axios.post(`${URI}${endpoint}`, body, { headers: headers });
    return response.data;
  }
  catch (e) {
    var errorDescription = e.response?.data?.error?.description;
    if (errorDescription != null) {
      toast.error(errorDescription, {
        toastId: "errorToast",
      });
    } else {
      toast.error("Something Went Wrong.", {
        toastId: "errorToast",
      });
    }

    console.log("remote_datasource", e);
    return null;
  }
}

export async function getRequest(URI, endpoint, headers) {
  if (headers == null) {
    headers = fetchHeaders();
  }

  try {
    const response = await axios.get(`${URI}${endpoint}`, { headers: headers });
    return response;
  }
  catch (e) {
    var errorDescription = e.response?.data?.error?.description;
    if (errorDescription != null) {
      toast.error(errorDescription, {
        toastId: "errorToast",
      });
    } else {
      toast.error("Something Went Wrong.", {
        toastId: "errorToast",
      });
    }

    console.log("remote_datasource", e);
    return null;
  }
}

export async function getRequestParams(URI, endpoint, params) {
  var headers = fetchHeaders();

  try {
    const response = await axios.get(`${URI}${endpoint}`, { params: params, headers: headers });
    return response.data;
  }
  catch (e) {
    var errorDescription = e.response?.data?.error?.description;
    if (errorDescription != null) {
      toast.error(errorDescription, {
        toastId: "errorToast",
      });
    } else {
      toast.error("Something Went Wrong.", {
        toastId: "errorToast",
      });
    }

    console.log("remote_datasource", e);
    return null;
  }
}

export async function putRequest(URI, endpoint, body) {

  try {
    const response = await axios.put(`${URI}${endpoint}`, { headers: fetchHeaders(), body: body });
    return response;
  }
  catch (e) {
    var errorDescription = e.response?.data?.error?.description;
    if (errorDescription != null) {
      toast.error(errorDescription, {
        toastId: "errorToast",
      });
    } else {
      toast.error("Something Went Wrong.", {
        toastId: "errorToast",
      });
    }

    console.log("remote_datasource", e);
    return null;
  }
}

export function fetchHeaders() {
  const currentState = store.getState().userReducer;
  return {
    Token: currentState.accessToken,
    TokenId: currentState.email || currentState.username,
    password: currentState.password,
    ClientId: currentState.clientId,
    AuthMethod: currentState.authMethod
  }
}

