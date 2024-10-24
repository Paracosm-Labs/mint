import React, { useState } from 'react';
import Image from "next/image";
import Upload from '../../components/upload';

const CreateClub = ({ onNext, onPrev, onDataUpdate, data }) => {
  const [type, setClubType] = useState(data.type || 'essential');
  const [clubImage, setClubImage] = useState(data.image || null);
  const [name, setClubName] = useState(data.name || '');
  const [description, setDescription] = useState(data.description || '');
  const [membershipFee, setClubPrice] = useState(data.membershipFee || '');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validate = () => {
    const newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = 'Club name is required';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!membershipFee || membershipFee < 10) {
      newErrors.membershipFee = 'Membership fee must be at least $10';
    }
    
    if (!clubImage) {
      newErrors.clubImage = 'Club image is required. Be sure to click upload once you select your image.';
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
        description: true,
        membershipFee: true,
        clubImage: true
      };
      setTouched(allTouched);
      return;
    }

    onDataUpdate("clubInfo", { 
      type, 
      image: clubImage?.url || clubImage, 
      description, 
      name,
      membershipFee 
    });
    onNext();
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    setErrors(validate());
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h3 className="mb-4">Club Details</h3>
      
      <div className="mb-3">
        <label htmlFor="type" className="form-label">Club Type</label>
        <select
          className="form-select"
          id="type"
          value={type}
          onChange={(e) => setClubType(e.target.value)}
          disabled
        >
          <option value="essential">Essential - Customers pay a one time fee to join your club.</option>
        </select>
        <small className="form-text text-muted">
          More options coming soon!
        </small>
      </div>

      <div className="mb-3">
        <label htmlFor="name" className="form-label">Club Name *</label>
        <input
          type="text"
          className={`form-control ${touched.name && errors.name ? 'is-invalid' : ''}`}
          id="name"
          value={name}
          onChange={(e) => setClubName(e.target.value)}
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
        <label htmlFor="description" className="form-label">Description *</label>
        <textarea
          className={`form-control ${touched.description && errors.description ? 'is-invalid' : ''}`}
          id="description"
          rows="3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={() => handleBlur('description')}
          required
        />
        {touched.description && errors.description && (
          <div className="invalid-feedback">
            <i className="fas fa-exclamation-circle me-1"></i>
            {errors.description}
          </div>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="clubImage" className="form-label">Club Image *</label>
        <Upload setImageUrl={setClubImage} />
        {touched.clubImage && errors.clubImage && (
          <div className="text-danger mt-2 small">
            <i className="fas fa-exclamation-circle me-1"></i>
            {errors.clubImage}
          </div>
        )}
        {clubImage && (
          <Image 
            src={clubImage.url} 
            alt="Club Image" 
            height={200} 
            width={400}  
            className='club-image-preview-a m-auto my-2' 
            style={{ width: '100%', height: 'auto', marginTop: '10px' }}
          />
        )}
        <small className="form-text text-muted">Recommended Dimensions - height 400px x width 800px</small>
      </div>

      <div className="mb-3">
        <label htmlFor="membershipFee" className="form-label">Membership Cost *</label>
        <input
          type="number"
          className={`form-control ${touched.membershipFee && errors.membershipFee ? 'is-invalid' : ''}`}
          id="membershipFee"
          value={membershipFee}
          onChange={(e) => setClubPrice(e.target.value)}
          onBlur={() => handleBlur('membershipFee')}
          min="10"
          required
        />
        {touched.membershipFee && errors.membershipFee && (
          <div className="invalid-feedback">
            <i className="fas fa-exclamation-circle me-1"></i>
            {errors.membershipFee}
          </div>
        )}
        <small className="form-text text-muted">
          Minimum value is $10 USDT/USDD
        </small>
      </div>

      <div className="d-flex justify-content-between">
        <button type="button" className="btn btn-outline-secondary" onClick={onPrev}>Previous</button>
        <button type="submit" className="btn btn-kmint-blue">Next</button>
      </div>
    </form>
  );
};

export default CreateClub;