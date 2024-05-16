// PrescriptionComponent.js
import React from 'react';

const PrescriptionComponent = ({ prescription }) => {
  return (
    <div>
      <h2>Doctor's Prescription</h2>
      <p>{prescription}</p>
    </div>
  );
};

export default PrescriptionComponent;
