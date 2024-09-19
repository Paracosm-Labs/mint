"use client";
import { useAuth } from "@/lib/AuthContext";
import React, { useEffect, useState } from "react";
import { confirmRedemption, getRedemptionRequests } from "@/lib/redemptions";
import { formatDate } from "@/lib/format";

const redemptionList = [
  {
    id: 1,
    owner: "Tx...8oPx",
    status: "Completed",
  },
  {
    id: 2,
    owner: "Tx...tp9x",
    status: "Pending",
  },
  {
    id: 2,
    owner: "Tx...7ogc",
    status: "Pending",
  },
];

function RedemptionsTable() {
  const { data } = useAuth();
  const [redemptions, setRedemptions] = useState([]);

  useEffect(() => {
    getRedemptionRequests(data.userData.clubs)
      .then((response) => setRedemptions(response))
      .catch((error) => console.error("Error fetching redemptions:", error));
  }, []);

  const approveRedemption = async (redemption) => {
    confirmRedemption(
      redemption.onChainClubId,
      redemption.onChainId,
      redemption.tokenId
    )
      .then((txID) => {
        console.log(`Redemption confirmed with transaction ID: ${txID}`);
        alert(`Redemption confirmed`);
        getRedemptionRequests(data.userData.clubs)
          .then((response) => setRedemptions(response))
          .catch((error) =>
            console.error("Error fetching redemptions:", error)
          );
      })
      .catch((error) => {
        console.error(error);
        alert("Failed to confirm redemption.");
      });
  };

  return (
    <div className="table-responsive">
      <table className="table table-striped table-sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Description</th>
            <th>Valid till</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {redemptions.map((redemption) => (
            <tr key={redemption.id}>
              <td>{redemption.id}</td>
              <td>{redemption.owner}</td>
              <td>{redemption.description}</td>
              <td>{formatDate(redemption.expiryDate)}</td>
              <td>{redemption.status}</td>
              <td>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => approveRedemption(redemption)}
                >
                  Approve
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RedemptionsTable;
