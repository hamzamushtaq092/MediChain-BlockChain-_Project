// MainComponent.js
import React from 'react';

import PrescriptionComponent from './PrescriptionComponent';
import MedicineRecommendationsComponent from './MedicineRecommendationsComponent';
const PharmacyPage = () => {
  const prescription = "Prescription details here";
  const recommendations = [
    { name: "Medicine A", quantity: "1 pill", timing: "Morning" },
    { name: "Medicine B", quantity: "2 pills", timing: "Afternoon" },
    // Add more recommendations as needed
  ];

  return (
    <div>
      <PrescriptionComponent prescription={prescription} />
      <MedicineRecommendationsComponent recommendations={recommendations} />
    </div>
  );
};

export default PharmacyPage;
