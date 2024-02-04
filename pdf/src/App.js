import { useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AiwithText from './AiwithText';
import GradeCase from './GradeCase';
import './App.css';

const App = ({}) => {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState(null);
  const [fileName, setFileName] = useState("No image selected");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: `e0b1f2da608f96419498`,
            pinata_secret_api_key: `62dc06dd5509e6b31cb8097b581d4f496798337ac3c14d9849afee6f944c729b`,
            "Content-Type": "multipart/form-data",
          },
        });
        const url = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
        // contract.add(account,ImgHash);
        setUrl(url);
        alert("Successfully File Uploaded");
        setFileName("No File selected");
        console.log(url);
        setFile(null);
      } catch (e) {
        alert("Unable to upload File to Pinata");
      }
    }
    // alert("Successfully Image Uploaded");
    setFileName("No File selected");
    setFile(null);
  };
  const retrieveFile = (e) => {
    const data = e.target.files[0]; //files array of files object
    console.log(data);
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      setFile(e.target.files[0]);
    };
    setFileName(e.target.files[0].name);
    e.preventDefault();
  };
  const handleFileAccess = async(url)=>{
    console.log(url);
    window.open(url, '_blank');
  };
  return (
    <Router>
      <div className="back"></div>
        <div className="top-1">
          <h1>Welcome to file uploading System</h1>
        </div>
        <div className="top">
          <div className="top-content">
            {/* <div className="top-head">
              <span class="top-title">01.</span>
              <p>Lightning.</p>
            </div> */}
          <form className="form" onSubmit={handleSubmit}>
            <div className="input-div">
            <input
              // disabled={!account}
              type="file"
              id="file-upload"
              name="data"
              onChange={retrieveFile}
            />
            </div>
            
            {/* <span className="textArea">Image: {fileName}</span> */}
            <div className="top-bottom">
              <button type="submit" className="upload" disabled={!file}>
              Upload File
              </button>
            </div>
            
          </form>
          </div>
          <div className="top-2"><button onClick={() => handleFileAccess(url)}>View Pdf</button></div>
          
          
        </div>
        <Routes>
          <Route path="/bot" element={<AiwithText />} />
          <Route path="/grade" element={<GradeCase/>} />
        </Routes>
    
    </Router>
    
  );
};
export default App;


/************************************************************************************* */

