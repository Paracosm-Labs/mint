"use client";
import React from "react";
import { Card, Button } from "react-bootstrap";
import { mintDeal } from "@/lib/club";
import { formatDate } from "@/lib/format";
import { toast } from "react-toastify";

function MintDeal({ deal, club, onMintSuccess }) { // Changed onHide to onMintSuccess
  const mint = async () => {
    try {
      console.log("minting");
      let txID = await mintDeal(club.onChainId, deal.onChainId);
      console.log("minting txn", txID);
      toast.success(`Deal Minted with Transaction ID - ${txID}`);
      onMintSuccess();
    } catch (error) {
      console.error("Error while minting", error);
      toast.error(`Minting this deal failed. Please try again.`);
    }
  };

  return (
    <Card
      key={deal.id}
      style={{ minWidth: "350px", maxWidth: "350px" }}
      className="flex-shrink-0"
    >
      <Card.Img variant="top" src={deal.image} alt={deal.description} className="deal-image-preview-b" />
      <Card.Body className="d-flex flex-column align-items-center">
        <Card.Text style={{ minHeight: "60px" }}>{deal.description}</Card.Text>
        <Card.Text className="text-muted">
          Valid to {deal.expiryDate ? formatDate(deal.expiryDate) : ""}
        </Card.Text>
        <div className="w-100 text-center">
          <Button className="btn-kmint-blue mb-2" onClick={mint}>
            Mint Now
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default MintDeal;
