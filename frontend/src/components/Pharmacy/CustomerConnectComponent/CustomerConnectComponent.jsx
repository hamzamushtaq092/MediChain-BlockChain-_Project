import React from "react";
import "./CustomerConnectComponent.css";

import { useNavigate} from "react-router-dom";

function CustomerConnectComponent() {
    const navigate= useNavigate();
  return (
    <div>
      <div className="pharmacy-customer-sign-main-container">
        <div className="pharmacy-customer-sign-main-container-heading">
          <p></p>
        </div>
        <div className="pharmacy-customer-sign-address-input">
          <label >Customer-Wallet Address</label>
          <input className="pharmacy-customer-sign-input" type="text" />
          <button className="pharmacy-customer-sign-button">Send OTP</button>
        
        </div>
       
        <div className="pharmacy-customer-sign-address-input">
          <label htmlFor="">OTP</label>
          <input className="pharmacy-customer-sign-input" type="text" />
          <button className="pharmacy-customer-sign-button" onClick={() => {navigate("/pharmacy/home")}}>
            Connect
            
            </button>
        </div>

        
      </div>
    </div>
  );
}

export default CustomerConnectComponent;
