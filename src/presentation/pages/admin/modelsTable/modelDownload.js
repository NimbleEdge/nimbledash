import {
  ACCESS_TOKEN,
  APP_BASE_MDS_URL,
  CLIENT_ID,
  COGNITO_USERNAME,
  USER_EMAIL,
} from "core/constants";
import axios from "axios";
import { toast } from "react-toastify";
import { getAuthMethod } from "core/utils";
import { atob, atobPolyfill } from "js-base64";

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
    console.log(base64);
    var binaryString = atob(base64);
    var bytes = new Uint8Array(binaryString.length);
    for (var i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

export const downloadModel = async ({modelName, modelVersion}) => {
    toast.success("Download started");
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
        })
        .then((res) => {
            toast.success("Download success");
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