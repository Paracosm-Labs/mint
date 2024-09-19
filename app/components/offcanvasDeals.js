import React, { useEffect, useState } from "react";
import { Offcanvas } from "react-bootstrap";
import MintDeal from "./mintDeals";
import { loadDealsForClub } from "@/lib/deal";

function OffcanvasDeals({ show, onHide, club }) {
  const [deals, setDeals] = useState([]);

  useEffect(() => {
    loadDealsForClub(club).then((deals) => {
      console.log("deals", deals);
      if (deals && deals.length) {
        setDeals(deals);
      }
    });
  }, [club]);

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
        {club ? (
          <div className="d-flex overflow-auto" style={{ gap: "10px" }}>
            {deals.map((deal) => (
              <MintDeal
                deal={deal}
                club={club}
                key={deal.txID}
                onSave={onHide}
              ></MintDeal>
            ))}
          </div>
        ) : (
          <div className="w-100 text-center">
            <p>No deals available</p>
          </div>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default OffcanvasDeals;
