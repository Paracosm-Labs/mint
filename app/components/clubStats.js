"use client";
import React, { useEffect, useState, useCallback } from "react";
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

  const load = useCallback(async () => {
    try {
      const clubId = await getClubIdFromEvent(data.userData.clubs.txID);
      const clubDetails = await getClubDetails(clubId);
      
      // Ensure clubDetails is defined before accessing its properties
      if (clubDetails) {
        setStatsData([
          { title: "Club Name", value: data.userData.clubs.name || 'Unknown' },
          { title: "Members", value: clubDetails.memberCount || 0 }, // Default to 0 if undefined
          // Add other stats here if available
        ]);
      } else {
        console.error("Club details not found.");
      }
    } catch (error) {
      console.error("Error loading club details:", error);
    }
  }, [data]);
  

  useEffect(() => {
    load();
    // return () => {}
  }, [load]);
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
