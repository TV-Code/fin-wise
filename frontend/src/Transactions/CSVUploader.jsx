import React, { useState } from 'react';
import { useCSVReader } from 'react-papaparse';

const CSVUploader = ({ onDrop }) => {
  const { CSVReader } = useCSVReader();
  const [zoneHover, setZoneHover] = useState(false);

  return (
    <CSVReader
      onUploadAccepted={onDrop}
      onDragOver={(event) => {
        event.preventDefault();
        setZoneHover(true);
      }}
      onDragLeave={(event) => {
        event.preventDefault();
        setZoneHover(false);
      }}
    >
      {({ getRootProps, acceptedFile }) => (
        <div {...getRootProps()} style={{border: '2px dashed #CCC', padding: '20px', textAlign: 'center'}}>
          {acceptedFile ? acceptedFile.name : 'Drop CSV file here or click to upload'}
        </div>
      )}
    </CSVReader>
  );
};

export default CSVUploader;
