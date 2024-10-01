// components/dealsMintedChart.js
import React, { useEffect, useState, useCallback } from 'react';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getDealsMintedForClub } from '@/lib/mintdeals';
import { getClubIdFromEvent } from "@/lib/club";
import { useAuth } from "@/lib/AuthContext";
import ClipLoader from "react-spinners/ClipLoader";
import EmptyState from './emptyState';  // Import EmptyState component

function DealsMintedChart() {
  const { data } = useAuth();
  const [chartData, setChartData] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDeals = useCallback(async () => {
    const now = Date.now();
    const sixMonthsAgo = now - 6 * 30 * 24 * 60 * 60 * 1000; // Approximate 6 months in milliseconds

    try {
      setLoading(true); // Set loading to true before fetching
      const clubId = await getClubIdFromEvent(data.userData.clubs.txID);
      const fetchedDeals = await getDealsMintedForClub(clubId, sixMonthsAgo, now);

      if (fetchedDeals.length === 0) {
        console.warn("No deals were fetched.");
      }

      // Process the deals to create data for the chart grouped by day and dealId
      const dailyRedemptions = fetchedDeals.reduce((acc, deal) => {
        const date = new Date(deal.timestamp).toLocaleDateString(); // Format as a readable date (MM/DD/YYYY)
        const dealId = deal.dealId; // Extract dealId
        if (!acc[date]) acc[date] = { date }; // Initialize object for this date if not already present
        acc[date][dealId] = (acc[date][dealId] || 0) + 1; // Increment the count for this dealId on this date
        return acc;
      }, {});

      // Format the data for the chart
      const formattedData = Object.keys(dailyRedemptions).map((day) => ({
        ...dailyRedemptions[day],
        name: day,
      }));

      setChartData(formattedData);
      setDeals(fetchedDeals); // Set the deals to display below the chart
      // console.log("LOOK SOME DEALS", fetchedDeals);
    } catch (error) {
      console.error("Error fetching and processing deals:", error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  }, [data]); // Add data as a dependency to useCallback

  useEffect(() => {
    fetchDeals(); // Fetch deals initially

    const intervalId = setInterval(fetchDeals, 69000); // Refresh every 69 seconds

    return () => clearInterval(intervalId); // Clear the interval on unmount
  }, [fetchDeals]); // Use fetchDeals as a dependency

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Trend of Minted Deals</h5>

        {loading ? ( // Show loading state while fetching data
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "300px", // Adjust this value as needed
            }}
          >
            <ClipLoader color="#98ff98" size={100} />
          </div>
        ) : chartData.length === 0 ? ( // Show EmptyState when no data is available
          <EmptyState iconClass="fa-chart-area" message="No deals minted in the last 6 months." />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            {/* <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis  dataKey="name"/>
              <YAxis />
              <Tooltip />
              <Legend />
              {deals.length > 0 &&
                Array.from(new Set(deals.map((deal) => deal.dealId))).map((dealId) => (
                  <Area
                    key={dealId}
                    type="monotone"
                    dataKey={dealId}
                    name={`Deal ${dealId}`}
                    stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`} // Random color for each dealId
                    fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
                  />
                ))}
            </AreaChart> */}

            <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name"/>
            <YAxis />
            <Tooltip />
            <Legend />
            {/* Dynamically create a Bar for each dealId */}
            {deals.length > 0 &&
              Array.from(new Set(deals.map((deal) => deal.dealId))).map((dealId) => (
                <Bar
                  key={dealId}
                  dataKey={dealId}
                  name={`Deal ${dealId}`}
                  fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} // Random color for each dealId
                />
              ))}
          </BarChart>
          </ResponsiveContainer>
        )}

      </div>
    </div>
  );
}

export default DealsMintedChart;
