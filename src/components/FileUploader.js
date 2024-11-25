import React, { useState } from "react";
import axios from "axios";

const FileUploader = () => {
  const [file, setFile] = useState(null);
  const [fileNames, setFileNames] = useState([]);

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Upload file to Dropbox
  const handleFileUpload = async () => {
    if (!file) {
      alert("Please select a file to upload!");
      return;
    }
  
    const url = "https://content.dropboxapi.com/2/files/upload";
    const headers = {
      Authorization: `Bearer ${process.env.REACT_APP_DROPBOX_ACCESS_TOKEN}`, // Make sure token is correct
      "Dropbox-API-Arg": JSON.stringify({
        path: `/${file.name}`,
        mode: "add",
        autorename: true,
        mute: false,
      }),
      "Content-Type": "application/octet-stream",
    };
  
    try {
      console.log("Access Token:", process.env.REACT_APP_DROPBOX_ACCESS_TOKEN);
      const fileData = await file.arrayBuffer(); // Convert file to binary data
      const response = await axios.post(url, fileData, { headers });
      console.log("File uploaded:", response.data);
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error.response?.data || error.message);
      alert("Failed to upload file!");
    }
  };
  

  // Fetch file names from Dropbox
  const fetchFileNames = async () => {
    const url = "https://api.dropboxapi.com/2/files/list_folder";
    const headers = {
      Authorization: `Bearer ${process.env.REACT_APP_DROPBOX_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    };
    const data = { path: "" };

    try {
      const response = await axios.post(url, data, { headers });
      const names = response.data.entries.map((entry) => entry.name);
      setFileNames(names);
      console.log("Fetched file names:", names);
    } catch (error) {
      console.error("Error fetching file names:", error);
      alert("Failed to retrieve file names!");
    }
  };

  return (
    <div className="file-uploader">
      <h1>Dropbox File Uploader</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Upload File</button>
      <button onClick={fetchFileNames}>Fetch File Names</button>
      <div className="file-list">
        <h3>Files in Dropbox:</h3>
        <ul>
          {fileNames.map((name, index) => (
            <li key={index}>{name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FileUploader;
