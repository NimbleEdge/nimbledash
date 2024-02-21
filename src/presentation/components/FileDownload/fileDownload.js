import React, { useState } from 'react';
import { toast } from 'react-toastify';
import HoverText from '../HoverText/hoverText';

const FileDownloadComponent = ({ fileName = 'downloaded_file', fetchFunction, fetchFuncData}) => {
  const handleDownload = async () => {
    try {
        const response = await fetchFunction({...fetchFuncData});
        const fileContent = response.data.taskCode;
        const blob = new Blob([fileContent], { type: 'text/plain' });
        const link = document.createElement('a');
        link.download = `${fileName}.py`;
        link.href = window.URL.createObjectURL(blob);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Script download successfull");
    } catch(error) {
        console.log(error);
        toast.error("Script download failed", {
            toastId: "errorToast",
        });
    }
  };

  return (
      <HoverText onHoverText={"Download"}>
        <img className={"download-model-icon"} src={"/assets/icons/download.svg"} onClick={handleDownload}></img>
      </HoverText>  
  );
};

export default FileDownloadComponent;
