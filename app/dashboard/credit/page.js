// src/app/credit/page.tsx
"use client";
import { useState, useEffect } from "react";
import CreditSummary from "../../components/creditSummary";
import CreditUsageHistory from "../../components/creditUsageHistory";
import BorrowModal from "../../components/borrowModal";
import RepayModal from "../../components/repayModal";

const CreditPage = () => {
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [showRepayModal, setShowRepayModal] = useState(false);
  const [refresh, setRefresh] = useState(false); // Add a refresh state

  const handleBorrowClick = () => {
    setShowBorrowModal(true);
  };

  const handleCloseBorrowModal = () => {
    setShowBorrowModal(false);
  };

  const handleRepayClick = () => {
    setShowRepayModal(true);
  };

  const handleCloseRepayModal = () => {
    setShowRepayModal(false);
  };

  const handleSuccess = () => {
    setRefresh(!refresh); // Toggle to trigger a refresh
  };

  // Auto refresh every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRefresh((prevRefresh) => !prevRefresh);
    }, 60000); // 60 seconds

    return () => clearInterval(interval); // Clean up on unmount
  }, []);

  return (
    <main className="col-md-10 ms-sm-auto col-lg-10 px-md-4">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3">
        <div className="col-md-7 col-sm-12">
          <h2>Credit Facility</h2>
          <p>
            Manage your business credit easily: borrow funds, make repayments and
            track your credit history—all in one place.
          </p>
        </div>
        <div className="col-md-5 col-sm-12 text-end">
          <button
            type="button"
            className="btn btn-md btn-outline-secondary me-2"
            onClick={handleRepayClick}
          >
            Make Repayment
          </button>
          <button
            type="button"
            className="btn btn-md btn-success mt-3 mb-3  mx-3"
            onClick={handleBorrowClick}
          >
            Borrow Now
          </button>
        </div>
      </div>
      <hr/>
      <div className="col-md-12">
        <CreditSummary refresh={refresh} /> {/* Pass refresh state */}
        <CreditUsageHistory refresh={refresh} />
      </div>

      {/* Borrow and Repay Modals */}
      <RepayModal
        show={showRepayModal}
        onHide={handleCloseRepayModal}
        onSuccess={handleSuccess}
        outstandingDebt={300}
      />
      <BorrowModal
        show={showBorrowModal}
        onHide={handleCloseBorrowModal}
        onSuccess={handleSuccess}
        availableCredit={500}
      />
    </main>
  );
};

export default CreditPage;
