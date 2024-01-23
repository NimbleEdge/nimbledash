import React, { useState } from 'react';
import { toast } from 'react-toastify';

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
      <button className={'download-btn'} onClick={handleDownload}>Download</button>
  );
};

export default FileDownloadComponent;
