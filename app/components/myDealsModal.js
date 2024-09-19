"use client";
import React, { useEffect, useState } from "react";
import { Modal, Card, Button } from "react-bootstrap";
import OffcanvasRedeem from "./offcanvasRedeem";
import { loadDealsForClub } from "@/lib/deal";
import {
  getTokenIdFromEvent,
  getNFTTokensForDeal,
  requestRedemption,
  getNFTsAndDealIdsInWallet,
} from "@/lib/mintdeals";
import { isRedemptionRequested } from "@/lib/redemptions";
import { formatDate } from "@/lib/format";

function MyDealsModal({ show, onHide, club }) {
  const [showRedeem, setShowRedeem] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [myDeals, setMyDeals] = useState([]);

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
      console.log("dealList", dealList);
    } catch (error) {
      console.error(error);
    }
    return dealList;
  };

  const load = async () => {
    debugger;
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
    load().then((dealList) => {
      if (dealList && dealList.length > 0) setMyDeals(dealList);
    });
  }, [club]);

  const handleRedeem = (deal) => {
    debugger;
    requestRedemption(deal.tokenId)
      .then((txID) => {
        console.log("Redemption txID ", txID);
        load().then((dealList) => {
          if (dealList && dealList.length > 0) setMyDeals(dealList);
        });
        alert(`Redemption Request submitted with txId : ${txID}`);
      })
      .catch((error) => {
        console.error("Redemption failed:", error);
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
                          <>Redemption Requested</>
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
        </Modal.Body>
      </Modal>

      <OffcanvasRedeem
        show={showRedeem}
        onHide={handleCloseRedeem}
        deal={selectedDeal}
      />
    </>
  );
}
export default MyDealsModal;
