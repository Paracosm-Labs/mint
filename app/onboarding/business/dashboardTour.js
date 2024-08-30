// DashboardTour.js
import React from 'react';

const DashboardTour = ({ onComplete, onPrev }) => {
  return (
    <div>
      <h3 className="mb-4">Dashboard Tour</h3>
      <p>Great job setting up your account! Let us take a quick tour of your new dashboard.</p>
      <div className="mb-3">
        <h5>Analytics Overview</h5>
        <p>Track the performance of your deals and customer engagement.</p>
      </div>
      <div className="mb-3">
        <h5>Create New Deals</h5>
        <p>Easily set up new deals to attract more customers.</p>
      </div>
      <div className="mb-3">
        <h5>Credit Access</h5>
        <p>Monitor your available credit and apply for additional funding.</p>
      </div>
      <div className="alert alert-success" role="alert">
        You are all set! If you have any questions, our support team is here to help.<br></br>
        Remember to login to your Tronlink wallet!
      </div>
      <div className="d-flex justify-content-between mt-5">
        <button type="button" className="btn btn-outline-secondary" onClick={onPrev}>Previous</button>
        <button type="button" className="btn btn-success" onClick={onComplete}>Complete Onboarding</button>
      </div>
    </div>
  );
};

export default DashboardTour;