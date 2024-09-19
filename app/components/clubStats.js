"use client";
import React, { useEffect, useState } from "react";
import { getClubDetails, getClubIdFromEvent } from "@/lib/club";
import { useAuth } from "@/lib/AuthContext";

// const statsData = [
//   { title: "Members", value: "1,234" },
//   { title: "Total Redemptions", value: "8,234" },
//   { title: "Revenue", value: "$15,678" },
// ];

function StatsCards() {
  const { data } = useAuth();
  const [statsData, setStatsData] = useState([]);
  console.log("userData", data);

  const load = async () => {
    const clubId = await getClubIdFromEvent(data.userData.clubs.txID);
    const clubDetails = await getClubDetails(clubId);
    console.log("clubDetails", clubDetails);
    setStatsData([
      ...statsData,
      { title: "Members", value: clubDetails.memberCount },
    ]);
  };

  useEffect(() => {
    load();
    // return () => {}
  }, []);
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
