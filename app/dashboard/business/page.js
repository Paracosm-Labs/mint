"use client";
import React, { useState } from "react";
import ClubStats from "../../components/clubStats";
import DealsMintedChart from "../../components/dealsMintedChart";
import RecentRedemptions from "../../components/recentRedemptions";
import SocialShare from "../../components/socialShare";

function BusinessDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleShareClick = () => {
    setIsModalOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  const clubUrl = "https://mintdeals.vercel.app/explore/club/id"; // Replace with actual club URL



  return (
    <main className="col-md-10 ms-sm-auto col-lg-10 px-md-4">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3">
      <div className="col-md-8">
        <h1 className="h2">Club Dashboard</h1>
        <p>Oversee your club’s performance: track activity and monitor progress seamlessly.</p>
        </div>
        <div className="col-md-3 text-end">
          {/* <button type="button" className="btn btn-sm btn-outline-secondary dropdown-toggle">
                <span data-feather="calendar"></span>
                This week
              </button> */}
          <button className="btn btn-outline-dark mx-2" onClick={handleShareClick}>
          <i class="fa-solid fa-share-nodes"></i>&nbsp;
                Share Club
              </button>
        </div>
      </div>
      <hr/>
      <ClubStats />
      <div className="row mt-4">
        <div className="col-md-12">
              <DealsMintedChart />
            </div>
      </div>
      <div className="row mt-4">
        {/* <div className="col-md-12">
              <RecentRedemptions />
            </div> */}
      </div>
      {isModalOpen && <SocialShare clubUrl={clubUrl} onClose={handleCloseModal} />}
    </main>
  );
}

export default BusinessDashboard;
