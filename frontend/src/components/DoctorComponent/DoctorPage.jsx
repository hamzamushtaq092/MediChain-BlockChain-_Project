import './DoctorPage.css';
import React, { useState } from "react";
import { Modal, Box, Typography, Button } from "@mui/material";
import { MdCancel } from "react-icons/md";
import axios from 'axios';
import { useNavigate} from "react-router-dom";
import { useEffect } from "react";



function DoctorPage() {

    ///////////////////////Fetch Docotor Data//////////////////////////////

  const navigate= useNavigate();
  const [doctorData, setdoctorData] = useState({});
  const [patientData, setpatientData] = useState({});
  const accessToken = {"accessToken":localStorage.getItem('userdata')}

  console.log(accessToken)
  function fetchData() {
    if (accessToken) {
      console.log("console access token",accessToken)
    axios
    .post("http://localhost:8000/api/v1/users/user-details",accessToken)
    .then((res) => { 
        setdoctorData(res.data.data);
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

  ///////////////////////////////////////////////////////

    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState('');

    const handleClose = () => {
        setOpen(false);
    };
    const handleConnect = () => {
        if (!email) {
          alert("Please Enter Email");
          return;
        }
    
        axios.post('http://localhost:8000/api/v1/patients/getPatientDetail', { email }) 
          .then(res => {
            console.log("Patient data:", res.data.data);
            setpatientData(res.data.data);
            navigate('/doctor/patientView', { state: { patientData: res.data.data } });
          })
          .catch(error => {
            if (error.response && error.response.status === 404) {
              alert("No Patient found with email. Enter Valid Email " );
            } else {
              alert("An error occurred while fetching patient data");
              console.error("Error fetching patient data:", error);
            }
          });
         }

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    return (
        <div className="doctor-page-container">
            <div className="doctor-page-header">
                <div className="doctor-page-profile">
                    <img src={doctorData.avatar} alt={doctorData.fullName} />
                    <h2>Welcome  {doctorData.fullName}</h2>
                </div>
            </div>

            <div className="doctor-page-content">
                <h1>Welcome to MediChain</h1>
                <p>MediChain is your trusted platform for medical diagnosis and treatment.</p>
                <button onClick={() => setOpen(true)}>Diagnose Patient</button>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '40%', // Center vertically
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
                            style={{ cursor: 'pointer', position: 'absolute', top: 10, right: 10, color: 'white' }}
                        />
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Enter Patient Email
                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            <input type="email" placeholder="Enter patient's email" style={{ width: '100%', padding: '10px', marginBottom: '10px' }} value={email} onChange={handleEmailChange} />
                        </Typography>
                        <div style={{ display: "flex", justifyContent: "center" }}> {/* Center the button horizontally */}
                            <Button onClick={handleConnect} style={{ marginTop: 20, backgroundColor: "white", color: "black", width: "200px", fontWeight: "bold" }}>
                                Connect
                            </Button>
                        </div>
                    </Box>
                </Modal>
            </div>
        </div>
    );
}

// Dummy data


export default DoctorPage;
