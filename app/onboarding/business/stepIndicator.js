// StepIndicator.js
import React from 'react';

const StepIndicator = ({ currentStep }) => {
  const steps = ['Business Info', 'Club Info', 'Create Deal', 'Dashboard Tour'];

  return (
    <div className="step-indicator mb-4">
      {steps.map((step, index) => (
        <div key={index} className={`step ${currentStep === index + 1 ? 'active' : ''}`}>
          {step}
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;