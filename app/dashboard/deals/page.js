"use client";
import React, { useState, useEffect } from "react";
import DealTable from "../../components/dealTable";
import DealModal from "../../components/dealModal";

function DealManagement() {
  const [showDealModal, setShowDealModal] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [refresh, setRefresh] = useState(0);

  const handleNewDeal = () => {
    setSelectedDeal(null);
    setShowDealModal(true);
  };

  const handleEditDeal = (offer) => {
    setSelectedDeal(offer);
    setShowDealModal(true);
  };

  const handleDeleteDeal = (offerId) => {
    // Implement delete logic here
    console.log("Deleting offer:", offerId);
  };

  const closeModal = () => {
    setShowDealModal(false);
    // setSelectedDeal(null);
    setRefresh((prev) => prev + 1);
  };

  return (
    <main className="col-md-10 ms-sm-auto col-lg-10 px-md-4">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3">
        <div className="col-md-7">
          <h1 className="h2">Manage Deals</h1>
          <p>Create and track your club&apos;s deals effortlessly to maximize customer engagement and loyalty.</p>
        </div>
        <div className="col-md-5 text-end">
          {/* <button type="button" className="btn btn-md btn-outline-secondary me-2">
                Export CSV
              </button> */}
          <button
            type="button"
            className="btn btn-md btn-kmint-blue"
            onClick={handleNewDeal}
          >
            New Deal
          </button>
        </div>
      </div>
      <hr/>
      <DealTable
        onEdit={handleEditDeal}
        onDelete={handleDeleteDeal}
        key={refresh}
      />
      <DealModal
        show={showDealModal}
        onHide={() => closeModal()}
        offer={selectedDeal}
      />
    </main>
  );
}

export default DealManagement;
