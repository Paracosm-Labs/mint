'use client';
import React, { useState } from 'react';
import CreditSummary from '../../components/creditSummary';
import CreditUsageHistory from '../../components/creditUsageHistory';
import MakePaymentModal from '../../components/makePaymentModal';
import BorrowModal from '../../components/borrowModal';

function CreditManagement() {
  const [showMakePaymentModal, setShowMakePaymentModal] = useState(false);
  const [showBorrowModal, setShowBorrowModal] = useState(false);

  return (
      <main className="kmint col-md-6 ms-sm-auto col-lg-6 px-md-4">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
          <h1 className="h2">Manage Credit</h1>
          <div className="btn-toolbar mb-2 mb-md-0">
            <button type="button" className="btn btn-md btn-outline-secondary me-2" onClick={() => setShowMakePaymentModal(true)}>
              Make Repayment
            </button>
            <button type="button" className="btn btn-md btn-success" onClick={() => setShowBorrowModal(true)}>
              Borrow Now
            </button>
          </div>
        </div>
        <CreditSummary />
        <CreditUsageHistory />
        <MakePaymentModal show={showMakePaymentModal} onHide={() => setShowMakePaymentModal(false)} />
        <BorrowModal show={showBorrowModal} onHide={() => setShowBorrowModal(false)} />
      </main>
  );
}

export default CreditManagement;