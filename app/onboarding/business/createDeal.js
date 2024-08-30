import React, { useState } from 'react';

const CreateDeal = ({ onNext, onPrev, onDataUpdate }) => {
  const [dealImage, setDealImage] = useState('');
  const [maxSupply, setMaxSupply] = useState('');
  const [description, setDealDescription] = useState('');
  const [validUntil, setDealValidTo] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onDataUpdate("dealInfo",{ /*dealImage,*/ maxSupply, description, validUntil });
    onNext();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="mb-4">Create Your First Deal</h3>
      {/* <div className="mb-3">
        <label htmlFor="dealImage" className="form-label">Deal Image</label>
        <input
          type="file"
          className="form-control"
          id="dealImage"
          value={dealImage}
          onChange={(e) => setDealImage(e.target.value)}
        />
      </div> */}
      <div className="mb-3">
        <label htmlFor="maxSupply" className="form-label">Max Supply</label>
        <input
          type="text"
          className="form-control"
          id="maxSupply"
          value={maxSupply}
          onChange={(e) => setMaxSupply(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="description" className="form-label">Description</label>
        <textarea
          className="form-control"
          id="description"
          rows={3}
          value={description}
          onChange={(e) => setDealDescription(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="DEALVALIDTO" className="form-label">Valid To</label>
        <input
          type="date"
          className="form-control"
          id="validUntil"
          value={validUntil}
          onChange={(e) => setDealValidTo(e.target.value)}
        />
      </div>
      <div className="alert alert-info mb-5" role="alert">
        <i className='fa fa-lightbulb mx-2'></i>
        As your customers redeem your deals, you'll be able to access a growing credit line through the power of Blockchain and DeFi. This can help you grow your business even further!
      </div>
      <div className="d-flex justify-content-between">
        <button type="button" className="btn btn-outline-secondary" onClick={onPrev}>Previous</button>
        <button type="submit" className="btn btn-kmint-blue">Next</button>
      </div>
    </form>
  );
};

export default CreateDeal;
