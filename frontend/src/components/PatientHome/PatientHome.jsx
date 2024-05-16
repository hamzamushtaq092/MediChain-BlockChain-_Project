import React from "react";
import "./PatientHome.css";

import { useState } from "react";
import { MdCancel } from "react-icons/md";
import axios from "axios";
import { useEffect } from "react";
import { Modal, Box, Typography, Button  } from "@mui/material";
import { useNavigate} from "react-router-dom";

function PatientHome() {
  const navigate= useNavigate();
 
  const [patientData, setPatientData] = useState({});
  const accessToken = {"accessToken":localStorage.getItem('userdata')}

  console.log(accessToken)
  function fetchData() {
    if (accessToken) {
      console.log("console access token",accessToken)
    axios
    .post("http://localhost:8000/api/v1/users/user-details",accessToken)
    .then((res) => {
      

      setTimeout(() => {
        setPatientData(res.data.data);
      }, 1000); 
      
    })
    .catch((err) => {
      console.log(err);
    });
    }
    else{
      return
    }
  }
  useEffect(() => {
    fetchData();
    
  }, []);


  console.log("kjsadjsahd   ",patientData.fullName)
  console.log("kjsadjsahd   ",patientData)


  // Define demo data
  const profileCardDetails = {
    photo: "photo",
    name: "John Doe",
    id: "123456789",
    age: 20,
  };

  const personalInfo = {
    gender: "Male",
    bloodGroup: "O+",
    allergies: "None",
    medicines: "None",
    height: "180 cm",
    weight: "70 kg",
    lastVisit: "2024-04-30",
  };

  const vitalSigns = [
    { name: "Blood Pressure", value: "120/80 mmHg" },
    { name: "Heart Rate", value: "75 bpm" },
    { name: "Temperature", value: "36.5°C" },
  ];

  const testReports = [
    "Report 1: Lorem ipsum dolor sit amet",
    "Report 2: Consectetur adipiscing elit",
  ];

  const prescriptions = [
    "Prescription 1: Lorem ipsum dolor sit amet",
    "Prescription 2: Consectetur adipiscing elit",
  ];





  
   
  

  // ============================================
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div className="home-page-main-container">
        <div className="home-page-header"><button className="patient-logout_btn" onClick={() => {localStorage.clear()
        navigate("/")
         
        }}  >Logout</button></div>
        <div className="home-page-body">
          
          <div className="home-page-body-main-container">
            <div className="home-page-body-main-container-left">
              <div className="patient-profile-card">
                <div className="patient-profile-card-photo">
                  <img src={patientData.avatar}/>
                  
                </div>
                <div className="patient-profile-card-name">
                  {patientData.fullName}
                </div>
                <div className="patient-profile-card-id">
                  {profileCardDetails.id}
                </div>
                <div className="patient-profile-card-age">
                  Age: 
                </div>
                <button className="patient-profile-card-view-profile-btn">
                  View Profile
                </button>
              </div>
              <div className="home-page-body-patient-status">
                <div className="home-page-body-patient-status-title">
                  Patient Status
                </div>
                <p>Active</p>
                <p>Recovery</p>
              </div>
              <div className="home-page-body-patient-information">
                <div className="home-page-body-patient-information-title">
                  Patient Information
                </div>
                {Object.entries(personalInfo).map(([key, value]) => (
                  <p key={key}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                  </p>
                ))}
              </div>
            </div>
            <div className="home-page-body-main-container-right">
              <div className="home-page-body-main-container-right-header">
                
              </div>
              <div className="home-page-body-main-container-right-body">
                <div className="vital-signs">
                  <h3>Vital Signs</h3>
                  {vitalSigns.map((item, index) => (
                    <p key={index}>
                      {item.name}: {item.value}
                    </p>
                  ))}
                </div>
                <div className="test-reports">
                  <h3>Test Reports</h3>
                  {testReports.map((item, index) => (
                    <p key={index}>{item}</p>
                  ))}
                </div>
                <div className="Prescriptions">
                  <h3>Prescriptions</h3>
                  {prescriptions.map((item, index) => (
                    <p key={index}>{item}</p>
                  ))}
                </div>
                <button
                  className="new-prescription-btn"
                  onClick={() => setOpen(true)}
                >
                  + Upload Reports
                </button>
               
               {/* form */}
               <Modal
  open={open}
  onClose={handleClose}
  aria-labelledby="modal-modal-title"
  aria-describedby="modal-modal-description"
>
  <Box
    sx={{
      position: 'absolute',
      top: '20%', // Center vertically
      left: '50%', // Center horizontally
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: 'black',
      boxShadow: 24,
      p: 4
    }}
  >
    <MdCancel
      size={20}
      className="ModalCloseBtn"
      onClick={handleClose}
      style={{ cursor: 'pointer', position: 'absolute', top: 10, right: 10 , color: 'white'}}
    />
    <Typography id="modal-modal-title" variant="h6" component="h2">
      Upload your Reports
    </Typography>
    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
      <input type="file" />
    </Typography>
    <div style={{ display: "flex", justifyContent: "center", hover: "red"}}> {/* Center the button horizontally */}
      <Button onClick={handleClose} style={{ marginTop: 20, backgroundColor: "white", color: "black", width: "200px" , fontWeight: "bold"}}>
        Upload
      </Button>
    </div>
  </Box>
</Modal>


{/* ------------------- */}
                 
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PatientHome;
