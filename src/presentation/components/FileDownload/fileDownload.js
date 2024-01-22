import React, { useState } from 'react';

const FileDownloadComponent = ({ fileName = 'downloaded_file', fetchFile}) => {
  const [fileData, setFileData] = useState(null);

  const handleDownload = async () => {
    try {
      const response = await fetchFile()

      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
      }

      const data = await response.blob();
      setFileData(data);

      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(data);
      downloadLink.download = fileName;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  return (
    <div>
      <button className={'download-btn'} onClick={handleDownload}>Download File</button>
    </div>
  );
};

export default FileDownloadComponent;
