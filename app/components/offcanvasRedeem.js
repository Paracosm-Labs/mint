import React from 'react';
import { Offcanvas,Button } from 'react-bootstrap';

function OffcanvasRedeem({ show, onHide, deal }) {
  return (
    <Offcanvas show={show} onHide={onHide} placement="top" className="kmint-redeem" style={{ zIndex: 1060 }}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>{deal ? deal.title : 'Redeem'}</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <div id="qr-generator" className="mb-3 text-center">
          {/* Generated QR code or other redeemable content */}
          <p>QR Code Placeholder</p>
        </div>
        {deal && (
          <div className="text-center">
            <p>{deal.description}</p>
            <p className="text-muted">
              Valid to {deal.validTo}
            </p>
          </div>
        )}
        <div className="d-flex justify-content-center mt-4">
          <Button variant="outline-secondary" onClick={onHide}>
            Close
          </Button>
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default OffcanvasRedeem;
