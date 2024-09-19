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
    <main className="kmint col-md-6 ms-sm-auto col-lg-6 px-md-4">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Manage Deals</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
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
