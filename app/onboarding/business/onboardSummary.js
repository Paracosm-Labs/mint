import React, { useState, useEffect } from 'react';
import CurrencySelector from '../../components/currencySelector';
import { getClubCreationFee } from "../../../lib/club";
import ClubDealRegistryABI from "../../../abi/ClubDealsRegistry"; 
import { clubDealRegistryAddress } from "../../../lib/address"; 

const OnboardSummary = ({ onComplete, onPrev, businessInfo, clubInfo }) => {
  const [selectedCurrency, setSelectedCurrency] = useState('USDT');
  const [clubCreationFee, setClubCreationFee] = useState(null); // State for the club creation fee
  const [loadingFee, setLoadingFee] = useState(true); // Loading state

  // Fetch the club creation fee when the component mounts
  useEffect(() => {
    const fetchClubCreationFee = async () => {
      try {
        const fee = await getClubCreationFee(ClubDealRegistryABI, clubDealRegistryAddress); // Pass ABI and address
        setClubCreationFee(fee); // Set the fee in state
      } catch (error) {
        console.error('Error fetching club creation fee:', error);
      } finally {
        setLoadingFee(false); // Stop the loading state
      }
    };

    fetchClubCreationFee(); // Call the function
  }, []);

  const handleComplete = () => {
    // Pass the selected currency to the onComplete function
    onComplete(selectedCurrency);
  };

  return (
    <div>
      <h3 className="mb-4">Review Your Details</h3>

      <div className="card mb-4">
        <div className="card-header">
          <h5>Business Information</h5>
        </div>
        <div className="card-body">
          <p><strong>Business Name:</strong> {businessInfo.name}</p>
          <p><strong>Industry:</strong> {businessInfo.industry}</p>
          <p><strong>Location:</strong> {businessInfo.country}</p>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header">
          <h5>Club Information</h5>
        </div>
        <div className="card-body">
          <p><strong>Club Name:</strong> {clubInfo.name}</p>
          <p><strong>Description:</strong> {clubInfo.description}</p>
          <p><strong>Membership Fee:</strong> {clubInfo.membershipFee} USDT/USDD</p>
        </div>
      </div>

      <div className="alert alert-info" role="alert">
        <i className="fa fa-info-circle mx-2"></i>
        {loadingFee ? (<>
            <span
            className="spinner-border spinner-border-sm me-2"
            role="status"
            aria-hidden="true"
          ></span>
        </>) : (
          <>
            Club Creation Fee: <strong>${clubCreationFee}</strong>.
            <br />
            Please ensure your TronLink wallet is connected and has sufficient funds.
          </>
        )}
      </div>

      <div className='mt-2 py-3'>
        <h6 className="fw-bold mb-2 text-center">Select Payment Currency</h6>
        <CurrencySelector
          selectedCurrency={selectedCurrency}
          setSelectedCurrency={setSelectedCurrency}
        />
      </div>
      <hr/>

      <div className="d-flex justify-content-between mt-3">
        <button type="button" className="btn btn-outline-secondary" onClick={onPrev}>
          Previous
        </button>
        <button type="button" className="btn btn-kmint-blue" onClick={handleComplete}>
          <img
            src={`/${selectedCurrency.toLowerCase()}.png`}
            alt={selectedCurrency}
            style={{ width: '24px', marginRight: '4px', marginLeft: '4px' }}
          />&nbsp;
          Pay & Complete Onboarding
        </button>
      </div>
    </div>
  );
};

export default OnboardSummary;
