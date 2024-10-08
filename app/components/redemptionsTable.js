"use client";
import { useAuth } from "@/lib/AuthContext";
import React, { useEffect, useState, useCallback } from "react";
import { confirmRedemption, getRedemptionRequests } from "@/lib/redemptions";
import { formatDate } from "@/lib/format";
import EmptyState from './emptyState';
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

function RedemptionsTable() {
  const { data } = useAuth();
  const [redemptions, setRedemptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [approvingRedemptionId, setApprovingRedemptionId] = useState(null);

  const loadRedemptions = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getRedemptionRequests(data.userData.clubs);
      setRedemptions(response);
    } catch (error) {
      console.error("Error fetching redemptions:", error);
    } finally {
      setIsLoading(false);
    }
  }, [data.userData.clubs]);

  useEffect(() => {
    loadRedemptions(); // Initial load

    const intervalId = setInterval(() => {
      loadRedemptions();
    }, 45000); // 45 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [loadRedemptions]);

  const approveRedemption = async (redemption) => {
    setApprovingRedemptionId(redemption.id);
    try {
      const txID = await confirmRedemption(
        redemption.onChainClubId,
        redemption.onChainId,
        redemption.tokenId
      );
      
      console.log(`Redemption confirmed with transaction ID: ${txID}`);
      toast.success("Redemption confirmed.");
  
      // Optimistically update the redemption status in the UI
      setRedemptions((prevRedemptions) =>
        prevRedemptions.map((r) =>
          r.id === redemption.id ? { ...r, status: "Confirmed" } : r
        )
      );
    } catch (error) {
      console.error("Error confirming redemption:", error);
      toast.error("Failed to confirm redemption.");
    } finally {
      setApprovingRedemptionId(null); // Reset approving state after process
      
      // Optionally: Trigger a background refresh to ensure data consistency
      loadRedemptions(); // Refresh the redemptions in the background
    }
  };

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '300px',
      }}>
        <ClipLoader color="#98ff98" size={100} />
      </div>
    );
  }

  if (redemptions.length === 0) {
    return (
      <EmptyState 
        iconClass="fa-receipt" 
        message="No redemption requests found."
      />
    );
  }

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
                  disabled={approvingRedemptionId === redemption.id} // Disable if currently approving this one
                >
                  {approvingRedemptionId === redemption.id ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Approving...
                    </>
                  ) : (
                    "Approve"
                  )}
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
