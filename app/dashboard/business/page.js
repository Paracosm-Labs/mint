'use client'
import React from 'react';
import ClubStats from '../../components/clubStats';
import RedemptionChart from '../../components/redemptionChart';
import RecentRedemptions from '../../components/recentRedemptions';

function BusinessDashboard() {

  return (
        <main className="kmint col-md-6 ms-sm-auto col-lg-6 px-md-4">
          <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 className="h2">Club Dashboard</h1>
            <div className="btn-toolbar mb-2 mb-md-0">
              {/* <button type="button" className="btn btn-sm btn-outline-secondary dropdown-toggle">
                <span data-feather="calendar"></span>
                This week
              </button> */}
              {/* <button className="btn btn-kmint-blue mx-2">
                Edit Club Info
              </button> */}
            </div>
          </div>
          <ClubStats />
          <div className="row mt-4">
            <div className="col-md-12">
              <RedemptionChart />
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-md-12">
              <RecentRedemptions />
            </div>
          </div>
        </main>
  );
}

export default BusinessDashboard;