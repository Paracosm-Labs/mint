import React, { useEffect, useState, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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

      // Process the deals to create data for the chart grouped by day
      const dailyRedemptions = fetchedDeals.reduce((acc, deal) => {
        const date = new Date(deal.timestamp).toLocaleDateString(); // Format as a readable date (MM/DD/YYYY)
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});

      // Format the data for the chart
      const formattedData = Object.keys(dailyRedemptions).map((day) => ({
        name: day,
        "Deals Minted": dailyRedemptions[day],
      }));

      setChartData(formattedData);
      setDeals(fetchedDeals); // Set the deals to display below the chart
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
          <EmptyState iconClass="fa-chart-bar" message="No deals minted in the last 6 months." />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Deals Minted" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        )}

      </div>
    </div>
  );
}

export default DealsMintedChart;
