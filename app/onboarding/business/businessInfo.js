import React, { useState, useEffect } from 'react';
import { countries } from '../../../utils/countries';
import categories from '../../../utils/categories';

const BusinessInfo = ({ onNext, onDataUpdate, data }) => {
  const [name, setBusinessName] = useState(data.name || '');
  const [email, setEmail] = useState(data.email || '');
  const [industry, setIndustry] = useState(data.industry || '');
  const [country, setCountry] = useState(data.country || '');
  const [hasDominicaDID, setHasDominicaDID] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

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

  const validateEmail = (email) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const validate = () => {
    const newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = 'Business name is required';
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!industry) {
      newErrors.industry = 'Please select your industry';
    }
    
    if (!country) {
      newErrors.country = 'Please select your country';
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Mark all fields as touched to show errors
      const allTouched = {
        name: true,
        email: true,
        industry: true,
        country: true
      };
      setTouched(allTouched);
      return;
    }

    onDataUpdate("businessInfo", { name, email, industry, country });
    onNext();
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    setErrors(validate());
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h3 className="mb-4">Business Information</h3>
      
      <div className="mb-3 d-none">
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
              Please acquire your Dominica Metaverse Bound Token (DMBT) to attain verified status.&nbsp;
              <a href="https://www.htx.com/support/84933699113560" target="_blank" rel="noopener noreferrer">Follow this guide</a> to get it.
            </small>
          </div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="name" className="form-label">Business Name *</label>
        <input
          type="text"
          className={`form-control ${touched.name && errors.name ? 'is-invalid' : ''}`}
          id="name"
          value={name}
          onChange={(e) => setBusinessName(e.target.value)}
          onBlur={() => handleBlur('name')}
          required
        />
        {touched.name && errors.name && (
          <div className="invalid-feedback">
            <i className="fas fa-exclamation-circle me-1"></i>
            {errors.name}
          </div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email *</label>
        <input
          type="email"
          className={`form-control ${touched.email && errors.email ? 'is-invalid' : ''}`}
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => handleBlur('email')}
          required
        />
        {touched.email && errors.email && (
          <div className="invalid-feedback">
            <i className="fas fa-exclamation-circle me-1"></i>
            {errors.email}
          </div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="industry" className="form-label">Industry *</label>
        <select
          className={`form-select ${touched.industry && errors.industry ? 'is-invalid' : ''}`}
          id="industry"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          onBlur={() => handleBlur('industry')}
          required
        >
          <option value="">Select your industry</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>{category}</option>
          ))}
        </select>
        {touched.industry && errors.industry && (
          <div className="invalid-feedback">
            <i className="fas fa-exclamation-circle me-1"></i>
            {errors.industry}
          </div>
        )}
      </div>

      <div className="mb-3">
        <label htmlFor="country" className="form-label">Location *</label>
        <select
          className={`form-select ${touched.country && errors.country ? 'is-invalid' : ''}`}
          id="country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          onBlur={() => handleBlur('country')}
          required
        >
          <option value="">Select your country</option>
          {countries.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
        {touched.country && errors.country && (
          <div className="invalid-feedback">
            <i className="fas fa-exclamation-circle me-1"></i>
            {errors.country}
          </div>
        )}
      </div>

      <div className="d-flex justify-content-end">
        <button type="submit" className="btn btn-kmint-blue">Next</button>
      </div>
    </form>
  );
};

export default BusinessInfo;