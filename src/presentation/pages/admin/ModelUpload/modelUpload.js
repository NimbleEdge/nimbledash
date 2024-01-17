import React, { useEffect, useState } from "react";
import "../admin_page.css";
import { useFilePicker } from "use-file-picker";
import { Buffer } from "buffer";
import { useDispatch, useSelector } from "react-redux";
import {
  ACCESS_TOKEN,
  APP_BASE_MDS_URL,
  CLIENT_ID,
  COGNITO_USERNAME,
  USER_EMAIL,
} from "core/constants";
import axios, { all } from "axios";
import { toast } from "react-toastify";
import { loaderActions } from "presentation/redux/stores/store";
import { getAuthMethod } from "core/utils";
import Table from "presentation/components/Table/table";
import { fetchModelList } from "data/apis";
import DropdownComponent from "presentation/components/dropdownMenu/dropdown";
import Modal from "presentation/components/modal/modal";
import "./modelUpload.css";
import { SelectableCardsList } from "presentation/components/RectangularCards/rectangularCards";

const uploadModelView = {
    UPLOAD_MODEL_VIEW: 0,
    CT_SELECTION_VIEW: 1
}

const ModelUpload = ({isNewModel, allTagsList, existingModelName = "", closeModal}) => {
  const dispatch = useDispatch();
  var modelContentBase64 = "";
  var modelConfigJson = {};
  var modelType = "";
  const updateType = ["Build", "Update", "Fix"];
  const [selectedUpdateTypeIndex, setSelectedUpdateTypeIndex] = useState(0);
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
  const [currentView, setCurrentView] = useState(uploadModelView.UPLOAD_MODEL_VIEW);
  const [selectedTags, setSelectedTags] = useState([]);
  const handleTagSelection = (tag) => {
    setSelectedTags(prevSelectedTags => {
        if (prevSelectedTags.includes(tag)) {
            return prevSelectedTags.filter(selectedTag => selectedTag !== tag);
        } else {
            return [...prevSelectedTags, tag];
        }
    });
}

  useEffect(() => {
    fetchModelList(setModelList, dispatch);
  }, []);

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
      if (isNewModel) {
        const modelName = document.getElementById("modelNameInput").value;
        if (modelName == null || modelName == "") {
          toast.error("Please enter a valid model name", {
            toastId: "errorToast",
          });
        } else {
          dispatch(loaderActions.toggleLoader(true));
          await axios
            .post(
              `${APP_BASE_MDS_URL}/api/v1/admin/model`,
              {
                modelConfig: modelConfigJson,
                modelName: modelName,
                model: modelContentBase64,
                fileType: modelType,
                deploymentTags: selectedTags
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
              closeModal();
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
      } else {
        dispatch(loaderActions.toggleLoader(true));
        await axios
          .post(
            `${APP_BASE_MDS_URL}/api/v1/admin/modelversion`,
            {
              modelConfig: modelConfigJson,
              modelName: existingModelName,
              model: modelContentBase64,
              updateType: selectedUpdateTypeIndex + 1,
              fileType: modelType,
              deploymentTags: selectedTags,
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
            closeModal();
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
    }
    dispatch(loaderActions.toggleLoader(false));
  };

  const downloadModel = async (modelName, modelVersion) => {
    await axios
      .get(
        `${APP_BASE_MDS_URL}/api/v1/admin/models/${modelName}/versions/${modelVersion}`,
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
    <>
            {currentView == uploadModelView.UPLOAD_MODEL_VIEW && <div className="modelUploadModal">
                <p className="heading4">Upload Model</p>
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
                            <p className="heading6 margin-top-8">Upload Model</p>
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
                    {   !isNewModel &&
                        <DropdownComponent
                            selectedItemIndex={selectedUpdateTypeIndex}
                            onChangeCallback={(selectedIndex) => {
                                setSelectedUpdateTypeIndex(selectedIndex)
                            }}
                            itemList={updateType}
                            customClass={"model-upload-custom-dropdown"}
                        ></DropdownComponent>
                    }
                    {isNewModel && (
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
                    {/* {!isNewModel &&
                    <DropdownComponent
                        selectedItemIndex={selectedModelIndex}
                        itemList={Array.from(
                        new Set(modelList.map((item) => item.modelName))
                        )}
                        onChangeCallback={(selectedIndex) => {
                        setSelectedModelIndex(selectedIndex);
                        }}
                        customClass={"model-upload-custom-dropdown"}>
                    </DropdownComponent>} */}
                    {/* <DropdownComponent
                        selectedItemIndex={selectedUploadTypeIndex}
                        onChangeCallback={(selectedIndex) => setSelectedUploadTypeIndex(selectedIndex)}
                        itemList={uploadType}
                        customClass={"model-upload-custom-dropdown"}
                    ></DropdownComponent> */}
                    <button onClick={() => setCurrentView(uploadModelView.CT_SELECTION_VIEW)} className="modelUpdateTagSelectionButton">Configure Compatability Tags</button>
                </div>
                <button className={`uploadButton`} onClick={uploadModel}>Upload</button>
            </div>}
            {
                currentView == uploadModelView.CT_SELECTION_VIEW && 
                <div>
                    <UploadModelCTSelection allTagsDetailsList={allTagsList} preSelectedTagsList={selectedTags} handleTagSelection={handleTagSelection} setCurrentView={setCurrentView} />
                </div>
            }
    </>
  );
}

export default ModelUpload;


const UploadModelCTSelection = ({allTagsDetailsList, preSelectedTagsList = [], handleTagSelection, setCurrentView}) => {
    const allTagsList = allTagsDetailsList.map(tag => {return {title: tag.name}});
    
    return (
        <div>
            <img className={"backArrow-modelUpload-tagSelection"} src={"/assets/icons/backArrow.svg"} onClick={() => setCurrentView(uploadModelView.UPLOAD_MODEL_VIEW)}></img>
            <SelectableCardsList cards={allTagsList} selectedCards={preSelectedTagsList} handleCardClick={handleTagSelection} />
        </div>
    )
}