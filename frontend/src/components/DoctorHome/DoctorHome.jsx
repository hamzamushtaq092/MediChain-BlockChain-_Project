import React from "react";
import "./DoctorHome.css";
import Modal from "react-modal";
import { useState } from "react";
import { MdCancel } from "react-icons/md";
import axios from "axios";
import { useEffect } from "react";
function DoctorHome() {
  const [isModalOpen, setIsModalOpen] = useState(false);
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


  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    address: "",
    city: "",
    email: "",
    phoneNo: "",
    password:"patient123",
    role: "patient",
    height: "",
    weight: "",
    bloodGroup: "",
   
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    if (formData.certification===false|| formData.certification===undefined) 
    {
      alert("Please accept the certification");
      return
  }
    e.preventDefault();
    console.log(formData);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="home-page-main-container">
        <div className="home-page-header"> <button className="new-patient-add-btn" onClick={() => setIsModalOpen(true)}>Add Patient</button> </div>
        <div className="home-page-body">
          <div className="home-page-body-title"></div>
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
                <button>Print Patient Report and Prescription</button>
                <button>Email Patient Report and Prescription</button>
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
                >
                  + Add a Prescription
                </button>

                <Modal isOpen={isModalOpen}>
     
          <MdCancel
          size={20}
          className="ModalCloseBtn"
          onClick={() => setIsModalOpen(false)}
          style={{ cursor: 'pointer', position: 'absolute', top: 10, right: 10 , color: 'Black'}}
        />
<form className="new-patient-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <div className="form-row">
          <div className="form-column">
            <label> First Name</label>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
          <div className="form-column">
            <label>Last Name </label>
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
          <div className="form-column">
            <label className="dob-label">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              placeholder="MM/DD/YYYY"
              value={formData.dateOfBirth}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className="form-group">
        <div className="form-row">
          <div className="form-column">
            <label> City</label>
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
            />
          </div>
          <div className="form-column">
            <label> State</label>
            <input
              type="text"
              name="state"
              placeholder="State / Province"
              value={formData.state}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-column">
            <label> Email </label>
            <input
              type="email"
              name="email"
              placeholder="example@example.com"
              value={formData.zipCode}
              onChange={handleChange}
            />
          </div>
          <div className="form-column">
            <label> Phone No </label>
            <input
              type="text"
              name="phoneNo"
              placeholder="(000) 000-0000"
              value={formData.zipCode}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
     
      
      <div className="form-group">
      <div className="group-title">
        <div className="title-heading">Health History</div>

        <div className="title-line"> </div>
      </div>

        <div className="form-row">
          <div className="form-column">
            <label> Height</label>
            <input
              type="text"
              name="height"
              placeholder="Height"
              value={formData.height}
              onChange={handleChange}
            />
          </div>
          <div className="form-column">
            <label> Weight</label>
            <input
              type="text"
              name="weight"
              placeholder="Weight"
              value={formData.weight}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-column">
            <label> Blood Group </label>
            <input
              type="text"
              name="bloodGroup"
              placeholder="AB+"
              value={formData.bloodGroup}
              onChange={handleChange}
            />
          </div>
        
        </div>
      </div>
      <button className="new-patient-submit-btn" type="submit">Submit</button>
    </form>
 
    </Modal>
               
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DoctorHome;
