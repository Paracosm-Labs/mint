import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useAuth } from "@/lib/AuthContext";
import { getDealDetails, getDealIdFromEvent } from "@/lib/deal";
import { formatDate } from "@/lib/format";
import EmptyState from './emptyState';
import { ClipLoader } from "react-spinners";

function DealTable({ onEdit }) {
  const { data } = useAuth();
  const [deals, setDeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadDeals = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "/api/deal?" +
          new URLSearchParams({
            club: data.userData.clubs._id,
            business: data.userData.businesses._id,
            owner: data.userData.user._id,
          }).toString()
      );

      const deals_ = await response.json();
      let deals = [];
      for (let index = 0; index < deals_.length; index++) {
        const deal_ = deals_[index];
        let { clubId, dealId } = await getDealIdFromEvent(deal_.txID);
        if (clubId && dealId) {
          let details = await getDealDetails(clubId, dealId);
          let deal = {
            description: deal_.description,
            image: "https://via.placeholder.com/200x150",
            txID: deal_.txID,
            ...details,
          };
          deals.push(deal);
        }
      }

      // Sort descending by dealId (most recent first)
      deals.sort((a, b) => b.dealId - a.dealId); 

      console.log(deals);
      setDeals(deals);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDeals();

    // Set up an interval to refresh deals every 30 seconds
    const interval = setInterval(() => {
      loadDeals();
    }, 30000); // 30 seconds

    // Clean up the interval on component unmount
    return () => clearInterval(interval);    

  }, []);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '300px',  // Adjust this value as needed
      }}>
        <ClipLoader color="#98ff98" size={100} />
      </div>
    );
  }

  if (deals.length === 0) {
    return (
      <EmptyState 
        iconClass="fa-tags" 
        message="No deals found. Create a new deal to get started!"
      />
    );
  }

  return (
    <div className="table-responsive">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Supply/Minted : (Max Supply)</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {deals.map((deal) => (
            <tr key={deal.dealId}>
              <td>{deal.dealId}</td>
              <td>
                {deal.remainingSupply}/{deal.redeemedSupply} : ({deal.maxSupply})
              </td>
              <td>
                {deal.description}
                <p className="text-muted text-small">
                  Valid Till: {formatDate(deal.expiryDate)}
                </p>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default DealTable;