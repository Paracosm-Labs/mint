import React, { useState, useEffect } from 'react';
import countries from '../../../utils/countries';
import categories from '../../../utils/categories';

const BusinessInfo = ({ onNext, onDataUpdate }) => {
  const [name, setBusinessName] = useState('');
  const [industry, setIndustry] = useState('');
  const [country, setCountry] = useState('');
  const [hasDominicaDID, setHasDominicaDID] = useState(false);

  useEffect(() => {
    // Placeholder logic to check for Dominica DID NFT in the wallet
    // Replace this with actual logic to interact with the wallet and check for the NFT
    const checkDominicaDID = async () => {
      // Example: simulate an API call or wallet check
      const userHasDID = false; // Replace with real check
      setHasDominicaDID(userHasDID);
    };

    checkDominicaDID();
  }, []);



  const handleSubmit = (e) => {
    e.preventDefault();
    onDataUpdate("businessInfo",{ name, industry, country });
    onNext();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="mb-4">Business Information</h3>
      
      <div className="mb-3">
        {hasDominicaDID ? (
          <div className="alert alert-success" role="alert">
            <i className="fa fa-check-circle mx-2"></i>
            Your wallet contains the required Dominica Metaverse Bound Token (DMBT).
          </div>
        ) : (
          <div className="alert alert-danger" role="alert">
            <i className="fa fa-times-circle mx-2"></i>
            Your wallet does not contain the required Dominica Metaverse Bound Token (DMBT).
            <br />
            <small className="form-text text-muted">
              Please acquire your Dominica Metaverse Bound Token (DMBT) to become a partner.&nbsp;
              <a href="https://www.htx.com/support/84933699113560" target="_blank" rel="noopener noreferrer">Follow this guide</a> to get it.
            </small>
          </div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="name" className="form-label">Business Name</label>
        <input
          type="text"
          className="form-control"
          id="name"
          value={name}
          onChange={(e) => setBusinessName(e.target.value)}
        //   required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="industry" className="form-label">Industry</label>
        <select
          className="form-select"
          id="industry"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
        //   required
        >
          <option value="">Select your industry</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="country" className="form-label">Location</label>
        <select
        className='form-select'
        id='country'
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        required
        >
        <option value="">Select your country</option>
        {countries.map((country) => (
            <option key={country.code} value={country.code}>
            {country.name}
            </option>
        ))}
        </select>
      </div>

      <div className="d-flex justify-content-end">
        <button type="submit" className="btn btn-kmint-blue">Next</button>
      </div>
    </form>
  );
};

export default BusinessInfo;