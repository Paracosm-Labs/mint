import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useAuth } from "@/lib/AuthContext";
import { getDealDetails, getDealIdFromEvent } from "@/lib/deal";
import { formatDate } from "@/lib/format";

function DealTable({ onEdit }) {
  const { data } = useAuth();
  const [deals, setDeals] = useState([]);

  const loadDeals = async () => {
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
      console.log(deals);
      setDeals(deals);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadDeals();
  }, []);

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
            <tr key={deal.id}>
              <td>
                {/* <img src={deal.image} alt={deal.description} width="100" /> */}
                {deal.dealId}
              </td>
              <td>
                {deal.remainingSupply}/{deal.redeemedSupply} : ({deal.maxSupply}
                )
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
