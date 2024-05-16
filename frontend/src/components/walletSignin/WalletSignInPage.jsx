import React from "react";
import "./WalletSigninPage.css";
import axios from "axios";
import { useState } from "react";
import { useNavigate} from "react-router-dom";
import { useEffect } from "react";



function WalletSignInPage({setLoginUser}) {
  
  const navigate= useNavigate();

  



  const [user, setuser] = useState({
    email: "",
    password: "",
    otp: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, " :data: ", value);
    setuser({ ...user, [name]: value });
  };


  
  const handleLogin = () => {
    const { email, password } = user;

    if (email && password) {
        axios.post("http://localhost:8000/api/v1/users/login", user)
            .then((res) => {
                const userData = res.data.data.user;
                const accessToken = res.data.data.accessToken;

                // Set user data and access token in state or local storage
                setLoginUser(userData);

                

                localStorage.setItem('userdata', accessToken);


                // Determine the route based on the user's role
                const role = userData.role;
                if (role === 'doctor') {
                    navigate("/doctor/home");
                } else if (role === 'pharmacy') {
                    navigate("/pharmacy/home");
                }
                else if(role==='patient'){
                    navigate("/patient/home");
                }
            })
            .catch((error) => {
                if (error.response && error.response.status === 401) {
                    // Invalid credentials
                    console.error("Invalid email or password");
                    alert("Invalid email or password");
                } else {
                    // Other error
                    console.error("Error logging in:", error);
                    alert("An error occurred while logging in");
                }
            });
    } else {
        alert("Enter Email and Password");
    }
};

  return (
    <div>
      <div className="wallet-main-container">
        <div className="wallet-main-container-heading">
          <p>Welcome to MediChain</p>
        </div>
        <div className="wallet-address-input">
         
          <label  htmlFor="email">
          Wallet Address || Email
            </label>
            <input
            className="wallet-input"
              name="email"
              value={user.email}
              id="email"
              type="text"
              onChange={handleChange}
            />

          <label htmlFor="password">Password</label>
            <input
            className="wallet-input"
              name="password"
              value={user.password}
              id="password"
              type="password"
              onChange={handleChange}
            />

         
        
        </div>
       
        <div className="wallet-address-input">
          
          <button className="wallet-button" onClick={handleLogin}>
            Connect

            </button>
        </div>

        
      </div>
    </div>
  );
}

export default WalletSignInPage;
