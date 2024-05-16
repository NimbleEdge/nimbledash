import React, { useEffect, useState } from "react";
import "./admin_page.css";
import DropdownComponent from "presentation/components/dropdownMenu/dropdown";
import SideBar from "presentation/components/sideBar/side_bar";
import { useFilePicker } from "use-file-picker";
import { encode as base64_encode } from "base-64";
import { Buffer } from "buffer";
import { Base64 } from "js-base64";
import { useDispatch, useSelector } from "react-redux";
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

function AdminPage() {
  const dispatch = useDispatch();
  var modelContentBase64 = "";
  var modelConfigJson = {};
  var modelType = "";
  const uploadType = ["New Model", "Build", "Update", "Fix"];
  const [selectedUploadTypeIndex, setSelectedUploadTypeIndex] = useState(0);
  const [selectedModelIndex, setSelectedModelIndex] = useState(0);
  const [modelList, setModelList] = useState([]);
  const [openFileSelector, { filesContent, loading }] = useFilePicker({
    accept: [".ort", ".tar", ".json"],
    readAs: "ArrayBuffer",
    multiple: true,
    limitFilesConfig: { max: 2, min: 2 },
  });
  const [openConfigSelector] = useFilePicker({
    accept: ".json",
    readAs: "Text",
    multiple: false,
  });

  const modelSizes = {
    CP_Reranker_lgbm_v01: 149.52,
    cross_session_lgbm_cea_label: 780.16,
    cross_session_lgbm_cj_label: 780.16,
    cross_session_lgbm_cea_round_level_ipl_2024: 778.66,
    cross_session_lgbm_cj_round_level_ipl_2024: 778.66,
    cross_session_lgbm_cj_session_level_ipl_2024: 778.66,
    in_session_lgbm_cj_session_level_ipl_2024: 777.18,
    SceneDetectorv6: 170.84,
    SpectateDetectorv2: 333.8,
    CombinedClassifierTightBox: 3164.16,
    SceneDetectorNewArch: 1304.4,
    NumClassifier: 2109.77,
    SceneDetectorv3: 162.65
  }


  useEffect(() => {
    fetchModelList();
  }, []);

  const fetchModelList = async () => {
    dispatch(loaderActions.toggleLoader(true));

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
        var listOfModels = res.data.models;
        setModelList(listOfModels);
      })
      .catch((e) => {
        console.log(e);
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
    dispatch(loaderActions.toggleLoader(false));
  };

  filesContent.map((file) => {
    if (file["name"].includes(".ort")) {
      const binary8 = new Uint8Array(file.content);
      modelContentBase64 = Buffer.from(binary8).toString("base64");
      modelType = "ort";
    } else if (file["name"].includes(".tar")) {
      const binary8 = new Uint8Array(file.content);
      modelContentBase64 = Buffer.from(binary8).toString("base64");
      modelType = "tar";
    } else {
      modelConfigJson = JSON.parse(new TextDecoder().decode(file.content));
    }
  });

  const uploadModel = async () => {
    if (modelContentBase64 == "") {
      toast.error("Please select a valid model", {
        toastId: "errorToast",
      });
    } else if (Object.keys(modelConfigJson).length == 0) {
      toast.error("Please select a valid model config", {
        toastId: "errorToast",
      });
    } else {
      if (selectedUploadTypeIndex == 0) {
        const modelName = document.getElementById("modelNameInput").value;
        if (modelName == null || modelName == "") {
          toast.error("Please enter a valid model name", {
            toastId: "errorToast",
          });
        } else {
          dispatch(loaderActions.toggleLoader(true));
          await axios
            .post(
              `${APP_BASE_MDS_URL}/mds/api/v1/admin/model`,
              {
                modelConfig: modelConfigJson,
                modelName: modelName,
                model: modelContentBase64,
                fileType: modelType,
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
              toast.success("Model uploaded successfully");
              fetchModelList();
            })
            .catch((e) => {
              console.log(e);
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
      } else {
        dispatch(loaderActions.toggleLoader(true));
        await axios
          .put(
            `${APP_BASE_MDS_URL}/mds/api/v1/admin/model`,
            {
              modelConfig: modelConfigJson,
              modelName: Array.from(
                new Set(modelList.map((item) => item.modelName))
              )[selectedModelIndex],
              model: modelContentBase64,
              updateType: selectedUploadTypeIndex,
              fileType: modelType,
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
            toast.success("Model updated successfully");
            fetchModelList();
          })
          .catch((e) => {
            console.log(e);
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
    }
    dispatch(loaderActions.toggleLoader(false));
  };

  const downloadModel = async (modelName, modelVersion) => {
    await axios
      .get(
        `${APP_BASE_MDS_URL}/mds/api/v1/admin/models/${modelName}/versions/${modelVersion}`,
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
        toast.success("Download started");

        var modelBinary = new Uint8Array(base64ToArrayBuffer(res.data.model));
        var modelConfig = res.data.modelConfig;

        saveFile(
          modelBinary,
          "application/octet-stream",
          modelName + "_" + modelVersion + "." + res["data"]["fileType"]
        );

        saveFile(
          JSON.stringify(modelConfig),
          "application/json",
          modelName + "_" + modelVersion + ".json"
        );
      })
      .catch((e) => {
        console.log(e);
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

  const saveFile = async (file, fileType, fileName) => {
    const blob = new Blob([file], {
      type: fileType,
    });

    const a = document.createElement("a");
    a.download = fileName;
    a.href = URL.createObjectURL(blob);
    a.addEventListener("click", (e) => {
      setTimeout(() => URL.revokeObjectURL(a.href), 30 * 1000);
    });
    a.click();
  };

  function base64ToArrayBuffer(base64) {
    var binaryString = atob(base64);
    var bytes = new Uint8Array(binaryString.length);
    for (var i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  return (
    <div className="adminPage">
      <div className="admin-page-left-pane">
        <div className="page-title">
          <p className="heading3">Admin Panel</p>
          <p className="subHeading">Manage Your ML Models.</p>
        </div>

        <p className="heading4 pane-title">Your uploads.</p>

        {modelList.map((item, index) => (
          <div className="model-holder-card">
            <div className="left-content">
              <p className="heading5">{item.modelName}</p>
              <div className="subHeadingFlex">
                <p className="subHeading3">{item.modelVersion}</p>
                <p className="subHeading3">|</p>
                <p className="subHeading3">{modelSizes[item.modelName] + ' KiB'}</p>
              </div>
            </div>
            <div
              className="right-content"
              onClick={() => downloadModel(item.modelName, item.modelVersion)}
            >
              <img
                className="clickable"
                src="/assets/icons/download_model.svg"
              ></img>
            </div>
          </div>
        ))}
      </div>

      <div className="divider flex-vertical"></div>

      <div className="admin-page-right-pane">
        <div className="page-title invisible">
          <p className="heading3 invisible">Dashboard</p>
          <p className="subHeading invisible">Live Analytical Updates.</p>
        </div>

        <p className="heading4">New upload.</p>

        <div className="upload-card-grid">
          <div
            className="upload-card clickable"
            onClick={async () => {
              try {
                await openFileSelector();
              } catch (err) {
                console.log("can't open file picker.");
              }
            }}
          >
            <div className="upload-card-content">
              <img src="/assets/icons/upload.svg"></img>
              <p className="heading6 margin-top-8">Upload Model & Config</p>
              {modelContentBase64 != "" &&
                Object.keys(modelConfigJson).length != 0 ? (
                <p className="subHeading2 selected-files">
                  Selected files: [{filesContent[0].name},{" "}
                  {filesContent[1].name}]
                </p>
              ) : (
                <p className="subHeading2">Max upload size is 20 MBs</p>
              )}
            </div>
          </div>

          <DropdownComponent
            selectedItemIndex={selectedUploadTypeIndex}
            onChangeCallback={(selectedIndex) => {
              setSelectedUploadTypeIndex(selectedIndex);
            }}
            itemList={uploadType}
            customClass={"model-upload-custom-dropdown"}
          ></DropdownComponent>
          {selectedUploadTypeIndex == 0 && (
            <form className="expanded">
              <input
                id="modelNameInput"
                type="text"
                name="clientID"
                className="model-upload-custom-dropdown"
                placeholder={"Enter Model Name"}
              />
            </form>
          )}
          {selectedUploadTypeIndex != 0 && (
            <DropdownComponent
              selectedItemIndex={selectedModelIndex}
              itemList={Array.from(
                new Set(modelList.map((item) => item.modelName))
              )}
              onChangeCallback={(selectedIndex) => {
                setSelectedModelIndex(selectedIndex);
              }}
              customClass={"model-upload-custom-dropdown"}
            ></DropdownComponent>
          )}
        </div>
        <div className="upload-button clickable" onClick={uploadModel}>
          <p className="buttonText center-text">Upload</p>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
