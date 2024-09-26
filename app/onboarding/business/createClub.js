// app/onboarding/business/createClub.js
import React, { useState } from 'react';
import Image from "next/image";
import Upload from '../../components/upload';


  const CreateClub = ({ onNext, onPrev, onDataUpdate, data }) => {
    const [type, setClubType] = useState(data.type || 'essential');
    const [clubImage, setClubImage] = useState(data.image || '');
    const [name, setClubName] = useState(data.name || '');
    const [description, setDescription] = useState(data.description || '');
    const [membershipFee, setClubPrice] = useState(data.membershipFee || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onDataUpdate("clubInfo",{ type, image: clubImage?.url || clubImage, description, name,membershipFee });
    onNext();
  };

  
  return (
    <form onSubmit={handleSubmit}>
      <h3 className="mb-4">Club Details</h3>
      <div className="mb-3">
        <label htmlFor="type" className="form-label">Club Type</label>
        <select
          className="form-select"
          id="type"
          value={type}
          onChange={(e) => setClubType(e.target.value)}
          required disabled
        >
          <option value="essential">Essential - Customers pay a one time fee to join your club.</option>
        </select>
        <small className="form-text text-muted">
          More options coming soon!
        </small>
      </div>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">Club Name</label>
        <input
          type="text"
          className="form-control"
          id="name"
          value={name}
          onChange={(e) => setClubName(e.target.value)}
          // required
        />
      </div>      
      <div className="mb-3">
        <label htmlFor="description" className="form-label">Description</label>
        <textarea
          className="form-control"
          id="description"
          rows="3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          // required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="clubImage" className="form-label">Club Image</label>
        <Upload setImageUrl={setClubImage} /> {/* Using the Upload component */}
        {clubImage && (
          <Image src={clubImage.url} alt="Club Image" 
            height={200} width={400}  className='club-image-preview-a m-auto my-2' 
          style={{ width: '100%', height: 'auto', marginTop: '10px' }} />
        )}<small className="form-text text-muted">Recommended Dimensions - height 400px x width 800px</small>
      </div>
      <div className="mb-3">
        <label htmlFor="membershipFee" className="form-label">Membership Cost</label>
        <input
          type="number"
          className="form-control"
          id="membershipFee"
          value={membershipFee}
          onChange={(e) => setClubPrice(e.target.value)}
          min="10"
          // required
        />
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
