'use client'
import React, { useState } from 'react';
import RedemptionsTable from '../../components/redemptionsTable';
import NewRedemptionModal from '../../components/newRedemptionModal';

function Redemptions() {
  const [showModal, setShowModal] = useState(false);

  const handleNewRedemption = () => {
    setShowModal(true);
  };

  return (
      <main className="col-md-10 ms-sm-auto col-lg-10 px-md-4">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3">
          <div className='col-md-8'>
            <h1 className="h2">Redemptions</h1>
            <p>
              Manage your business credit easily: borrow funds, make repayments and
              track your credit history—all in one place.
            </p>
          </div>
          <div className="btn-toolbar mb-2 mb-md-0">
            {/* <button type="button" className="btn btn-md btn-outline-secondary me-2">
              Export CSV
            </button> */}
            {/* <button type="button" className="btn btn-md btn-kmint-blue" onClick={handleNewRedemption}>
              New Redemption
            </button> */}
          </div>
        </div>
        <hr/>
        <RedemptionsTable />
        {/* <NewRedemptionModal show={showModal} onHide={() => setShowModal(false)} /> */}
      </main>
  );
}

export default Redemptions;