// components/mintDeals.js
"use client";
import React, { useEffect, useState } from "react";
import { Card, Button, Spinner, Badge } from "react-bootstrap";
import { mintDeal, getMintStatus } from "@/lib/club";
import { formatDate } from "@/lib/format";
import { toast } from "react-toastify";

function MintDeal({ deal, club, onMintSuccess }) {
  const [mintCount, setMintCount] = useState(0);
  const [maxMints, setMaxMints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [canMint, setCanMint] = useState(false);
  const [minting, setMinting] = useState(false);

  useEffect(() => {
    const fetchMintStatus = async () => {
      try {
        const [currentMints, maxAllowedMints] = await getMintStatus(
          club.onChainId,
          deal.onChainId,
          window.tronWeb.defaultAddress.base58
        );
        setMintCount(currentMints);
        setMaxMints(maxAllowedMints);
        setCanMint(currentMints < maxAllowedMints);
      } catch (error) {
        console.error("Error fetching mint status", error);
        toast.error("Error fetching mint status.");
      } finally {
        setLoading(false);
      }
    };

    fetchMintStatus();
  }, [club.onChainId, deal.onChainId]);

  const mint = async () => {
    setMinting(true); // Start spinner
    try {
      console.log("minting");
      let txID = await mintDeal(club.onChainId, deal.onChainId);
      console.log("minting txn", txID);
      toast.success(`Deal Minted with Transaction ID - ${txID}`);
      onMintSuccess();
    } catch (error) {
      console.error("Error while minting", error);
      toast.error(`Minting this deal failed. Please try again.`);
    } finally {
      setMinting(false); // Stop spinner
    }
  };

  return (
    <Card
      key={deal.id}
      style={{ minWidth: "350px", maxWidth: "350px" }}
      className="flex-shrink-0"
    >
      <Card.Img variant="top" src={deal.image} alt={deal.description} className="deal-image-preview-b rounded" />
      <Card.Body className="d-flex flex-column align-items-center">
        <Card.Text style={{ minHeight: "60px" }}>{deal.description}</Card.Text>

        {loading ? (
          <Spinner animation="border" />
        ) : (
          <>
            <div className="w-100 text-center">
              <Button
                className="btn-kmint-blue mb-2"
                onClick={mint}
                disabled={!canMint || minting} // Disable if minting is in progress
              >
                {minting ? (<>
                  <Spinner animation="border" size="sm" /> 
                  &nbsp;Minting...
                  </>) : (
                  "Mint Now"
                )}
              </Button>
            </div>
            {/* Show mint status */}
            <small className="text-muted">
              Mints Left: {maxMints - mintCount}
            </small>
            <Badge className="text-white p-2 m-2 bg-secondary">
              Valid to {deal.expiryDate ? formatDate(deal.expiryDate) : ""}
            </Badge>
          </>
        )}
      </Card.Body>
    </Card>
  );
}

export default MintDeal;
