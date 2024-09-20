import React, { useEffect, useState } from "react";
import { Offcanvas } from "react-bootstrap";
import MintDeal from "./mintDeals";
import { loadDealsForClub } from "@/lib/deal";
import { ClipLoader } from "react-spinners";
import EmptyState from './emptyState';

function OffcanvasDeals({ show, onHide, club }) {
  const [deals, setDeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (club) {
      setIsLoading(true);
      loadDealsForClub(club)
        .then((deals) => {
          console.log("deals", deals);
          if (deals && deals.length) {
            setDeals(deals);
          } else {
            setDeals([]);
          }
        })
        .catch((error) => {
          console.error("Error loading deals:", error);
          setDeals([]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [club]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '200px',
        }}>
          <ClipLoader color="#98ff98" size={100} />
        </div>
      );
    }

    if (!club || deals.length === 0) {
      return (
        <EmptyState 
          iconClass="fa-tags" 
          message="No deals available for this club, yet."
        />
      );
    }

    return (
      <div className="d-flex overflow-auto" style={{ gap: "10px" }}>
        {deals.map((deal) => (
          <MintDeal
            deal={deal}
            club={club}
            key={deal.txID}
            onSave={onHide}
          />
        ))}
      </div>
    );
  };

  return (
    <Offcanvas
      show={show}
      onHide={onHide}
      placement="bottom"
      className="kmint-deals"
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>{club ? club.name : "Deals"}</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {renderContent()}
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default OffcanvasDeals;