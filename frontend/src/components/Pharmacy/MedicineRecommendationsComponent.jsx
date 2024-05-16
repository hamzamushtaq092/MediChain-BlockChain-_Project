import React from 'react';
import './MedicineRecommendationComponent.css'; // Import CSS file

const MedicineRecommendationsComponent = ({ recommendations }) => {
  return (
    <div className="medicine-container">
      <h2>Medicine Recommendations</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Timing</th>
          </tr>
        </thead>
        <tbody>
          {recommendations.map((recommendation, index) => (
            <tr key={index}>
              <td>{recommendation.name}</td>
              <td>{recommendation.quantity}</td>
              <td>{recommendation.timing}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MedicineRecommendationsComponent;
