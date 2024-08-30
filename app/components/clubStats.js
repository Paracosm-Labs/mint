// components/statsCards.js
import React from 'react';

const statsData = [
  { title: "Members", value: "1,234" },
  { title: "Total Redemptions", value: "8,234" },
  { title: "Revenue", value: "$15,678" },
];

function StatsCards() {
  return (
    <div className="row">
      {statsData.map((stat, index) => (
        <div key={index} className="col-md-4">
          <div className="card mb-4 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">{stat.title}</h5>
              <p className="card-text fs-4">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatsCards;