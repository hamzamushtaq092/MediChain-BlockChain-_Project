import './App.css';

import CustomerConnectComponent from './components/Pharmacy/CustomerConnectComponent/CustomerConnectComponent';
import PharmacyHome from './components/Pharmacy/PharmacyHome/PharmacyHome';
import WalletSignInPage from './components/walletSignin/WalletSignInPage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import DoctorHome from './components/DoctorHome/DoctorHome';
import PatientHome from './components/PatientHome/PatientHome';
import NewPatientForm from './components/NewPatientForm';

function App() {
  const [loginUser, setLoginUser] = useState({});

  return (
    <>
    <BrowserRouter>
    <Routes>
    <Route
          path="/home"
          element={loginUser && loginUser._id ? 
             
          <PharmacyHome /> 
          : <WalletSignInPage setLoginUser={setLoginUser} />}
        />
      

      <Route path="/" element={<WalletSignInPage setLoginUser={setLoginUser} />} />

    
      <Route path="/test" element={<NewPatientForm />} />
    
      <Route path="/pharmacy" element={<CustomerConnectComponent />} />
      <Route path="/pharmacy/home" element={<PharmacyHome />} />
      <Route path="/patient/home" element={<PatientHome />} />
      <Route path="/doctor/home" element={<DoctorHome />} />
    </Routes>
    </BrowserRouter>

         </>
  );
}

export default App;
