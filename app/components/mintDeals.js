"use client";
import React, { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";
import { mintDeal } from "@/lib/club";
import { formatDate } from "@/lib/format";

function MintDeal({ deal, club, onHide }) {
  const mint = async () => {
    try {
      console.log("minting");
      let txID = await mintDeal(club.onChainId, deal.onChainId);
      console.log("mintin trxn", txID);
      alert(`Deal Minted with Transaction id ${txID}`);
      onHide();
    } catch (error) {
      console.error(("Error while minting", error));
    }
  };

  return (
    <Card
      key={deal.id}
      style={{ minWidth: "350px", maxWidth: "350px" }}
      className="flex-shrink-0"
    >
      <Card.Img variant="top" src={deal.image} alt={deal.description} />
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
