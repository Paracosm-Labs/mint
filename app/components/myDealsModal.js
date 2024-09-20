"use client";
import React, { useEffect, useState } from "react";
import { Modal, Card, Button } from "react-bootstrap";
import { loadDealsForClub } from "@/lib/deal";
import {
  requestRedemption,
  getNFTsAndDealIdsInWallet,
} from "@/lib/mintdeals";
import { isRedemptionRequested } from "@/lib/redemptions";
import { formatDate } from "@/lib/format";
import EmptyState from './emptyState';
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

function MyDealsModal({ show, onHide, club }) {
  const [showRedeem, setShowRedeem] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [myDeals, setMyDeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [redeemingDealId, setRedeemingDealId] = useState(null); // Track which deal is being redeemed

  const loadNFTs = async () => {
    let dealList = [];
    try {
      let nfts = await getNFTsAndDealIdsInWallet();

      for (let index = 0; index < nfts.length; index++) {
        const nft = nfts[index];
        let isRequested = await isRedemptionRequested(nft.tokenId);
        let deal_ = { ...nft, requested: isRequested };
        dealList.push(deal_);
      }
    } catch (error) {
      console.error(error);
    }
    return dealList;
  };

  const load = async () => {
    let dealList = [];
    let nfts = await loadNFTs();
    let deals = await loadDealsForClub(club);
    for (let index = 0; index < nfts.length; index++) {
      const nft = nfts[index];
      for (let index = 0; index < deals.length; index++) {
        const deal_ = deals[index];
        if (deal_.onChainId === nft.dealId) {
          let isRequested = await isRedemptionRequested(nft.tokenId);
          let deal = { ...deal_, ...nft, requested: isRequested };
          dealList.push(deal);
        }
      }
    }
    return dealList;
  };

  useEffect(() => {
    setIsLoading(true); // Set loading to true at the start
    load()
      .then((dealList) => {
        setMyDeals(dealList);
        setIsLoading(false); // Set loading to false once data is loaded
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }, [club]);

  const handleRedeem = (deal) => {
    setRedeemingDealId(deal.tokenId); // Set the deal as being redeemed

    requestRedemption(deal.tokenId)
      .then((txID) => {
        console.log("Redemption txID ", txID);

        // Wait for on-chain confirmation
        const checkOnChainStatus = async () => {
          let isRequested = false;
          while (!isRequested) {
            isRequested = await isRedemptionRequested(deal.tokenId); // Poll the on-chain status
            if (isRequested) {
              load().then((dealList) => {
                setMyDeals(dealList);
                setRedeemingDealId(null); // Reset the redeeming state once confirmed
              });
            } else {
              // If not confirmed, wait and try again (polling)
              await new Promise((resolve) => setTimeout(resolve, 5000)); // Poll every 5 seconds
            }
          }
        };

        checkOnChainStatus();

        toast.success(`Redemption Request submitted with txId: ${txID}`);
      })
      .catch((error) => {
        console.error("Redemption failed:", error);
        setRedeemingDealId(null); // Reset the redeeming state if there's an error
        toast.error("Redemption request failed. Please try again.");
      });

    setSelectedDeal(deal);
    setShowRedeem(true);
  };

  const handleCloseRedeem = () => {
    setShowRedeem(false);
    setSelectedDeal(null);
  };

  return (
    <>
      <Modal show={show} onHide={onHide} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>My Minted Deals</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isLoading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "300px", // Adjust height as needed
              }}
            >
              <ClipLoader color="#98ff98" size={100} />
            </div>
          ) : myDeals.length === 0 ? (
            <EmptyState 
              iconClass="fa-receipt" 
              message="You do not own any deals."
            />
          ) : (
            <div className="d-flex flex-column" style={{ gap: "20px" }}>
              {myDeals.map((deal) => (
                <Card key={deal.txID} className="mb-2">
                  <div className="row g-0">
                    <div className="col-md-3">
                      <Card.Img
                        variant="top"
                        src={deal.image}
                        alt={deal.description}
                        className="img-fluid rounded-start p-3"
                      />
                    </div>
                    <div className="col-md-9">
                      <Card.Body className="d-flex flex-column text-start">
                        <div>
                          <Card.Text>{deal.description}</Card.Text>
                          <Card.Text className="text-muted">
                            Valid to {formatDate(deal.expiryDate)}
                          </Card.Text>
                        </div>
                        <div className="d-flex justify-content-end align-items-center mt-3">
                          {deal.requested ? (
                            <>
                              <Button className="btn-secondary btn-sm" disabled>Redemption Requested</Button>
                            </>
                          ) : redeemingDealId === deal.tokenId ? (
                            <Button className="btn-kmint-blue" disabled>
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                                aria-hidden="true"
                              ></span>
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
                      </Card.Body>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* <OffcanvasRedeem
        show={showRedeem}
        onHide={handleCloseRedeem}
        deal={selectedDeal}
      /> */}
    </>
  );
}

export default MyDealsModal;
