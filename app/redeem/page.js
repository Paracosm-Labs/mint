// redeem/page.js
"use client";
import React, { useEffect, useState, useCallback } from "react";
import { loadAllDeals } from "@/lib/deal"; // Function to load all deals
import { requestRedemption, getAllNFTsAndDealIdsInWallet } from "@/lib/mintdeals";
import { isRedemptionRequested } from "@/lib/redemptions";
import { Card, Button } from "react-bootstrap";
import { ClipLoader } from "react-spinners";
import EmptyState from "@/app/components/emptyState";
import { formatDate } from "@/lib/format";
import { toast } from "react-toastify";

function RedeemPage() {
  const [myDeals, setMyDeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [redeemingDealId, setRedeemingDealId] = useState(null);

  // Load NFTs from the user's wallet
  const loadNFTs = async () => {
    let dealList = [];
    try {
      const nfts = await getAllNFTsAndDealIdsInWallet(); // Adjust this as needed to get the current user's wallet NFTs
      for (const nft of nfts) {
        const isRequested = await isRedemptionRequested(nft.tokenId);
        dealList.push({ ...nft, requested: isRequested });
      }
    } catch (error) {
      console.error("Error loading NFTs:", error);
    }
    return dealList;
  };

  // Load deals and match with user's NFTs
  const loadDeals = useCallback(async () => {
    setIsLoading(true);
    let dealList = [];
    try {
      const allDeals = await loadAllDeals(); // Fetch all deals for all clubs
      const nfts = await loadNFTs(); // Load NFTs in wallet

      // Match NFTs with available deals
      for (const nft of nfts) {
        const deal = allDeals.find(deal => deal.onChainId === nft.dealId.toString());
        if (deal) {
          dealList.push({ ...deal, ...nft });
        }
      }
    } catch (error) {
      console.error("Error loading deals:", error);
    } finally {
      setIsLoading(false);
    }
    return dealList;
  }, []);

  useEffect(() => {
    loadDeals().then(setMyDeals);
  }, [loadDeals]);

  const handleRedeem = (deal) => {
    setRedeemingDealId(deal.tokenId);

    requestRedemption(deal.tokenId)
      .then((txID) => {
        console.log("Redemption txID ", txID);

        // Check on-chain status
        const checkOnChainStatus = async () => {
          let isRequested = false;
          while (!isRequested) {
            isRequested = await isRedemptionRequested(deal.tokenId); // Poll the on-chain status
            if (isRequested) {
              loadDeals().then(setMyDeals); // Reload deals once confirmed
              setRedeemingDealId(null);
            } else {
              await new Promise((resolve) => setTimeout(resolve, 3000)); // Poll every 3 seconds
            }
          }
        };

        checkOnChainStatus();
        toast.success(`Redemption request for ${deal.description} submitted.`);
      })
      .catch((error) => {
        console.error("Redemption failed:", error);
        setRedeemingDealId(null);
        toast.error("Redemption request failed. Please try again.");
      });
  };

  return (
    <div className="kmint container">
      <div className="row">
        <div className="col-12 text-center mb-4">
          <h2 className="display-6">Redeem Your Deals</h2>
        </div>
      </div>
      
      {isLoading ? (
        <div className="row justify-content-center align-items-center" style={{ minHeight: "300px" }}>
          <div className="col-auto">
            <ClipLoader color="#98ff98" size={150} />
          </div>
        </div>
      ) : myDeals.length === 0 ? (
        <div className="row justify-content-center align-items-center" style={{ minHeight: "300px" }}>
          <div className="col-auto text-center">
            <i className="fas fa-receipt fa-3x mb-3 text-muted"></i>
            <p className="h5 text-muted">No deals available to redeem.</p>
          </div>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {myDeals.map((deal) => (
            <div className="col" key={`${deal.txID}-${deal.tokenId}`}>
              <Card className="h-100">
                <div className="row g-0 h-100">
                  <div className="col-md-12">
                    <div style={{ 
                      height: '200px', 
                      overflow: 'hidden', 
                      position: 'relative' 
                    }}>
                      <Card.Img 
                        src={deal.image} 
                        alt={deal.description} 
                        style={{
                          objectFit: 'cover',
                          width: '100%',
                          height: '100%'
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <Card.Body className="d-flex flex-column">
                      <Card.Text className="flex-grow-1">{deal.description}</Card.Text>
                      <div className="mt-auto">
                        <Card.Text className="text-muted mb-3">
                          Valid to {formatDate(deal.expiryDate)}
                        </Card.Text>
                        <div className="d-flex justify-content-center">
                          {deal.requested ? (
                            <Button 
                              variant="secondary" 
                              size="sm" 
                              disabled
                            >
                              Redemption Requested
                            </Button>
                          ) : redeemingDealId === deal.tokenId ? (
                            <Button 
                              className="btn-kmint-blue" 
                              disabled
                            >
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Requesting...
                            </Button>
                          ) : (
                            <Button 
                              className="btn-kmint-blue" 
                              onClick={() => handleRedeem(deal)}
                            >
                              Request Redemption
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card.Body>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
  
}

export default RedeemPage;
