import React, { useState } from 'react';
import { Modal, Card, Button } from 'react-bootstrap';
import OffcanvasRedeem from './offcanvasRedeem';

const dealData = [
  {
    id: 1,
    image: 'https://picsum.photos/200/100?random=1',
    description: 'Get 20% off on selected electronics at participating stores.',
    validTo: '2023-08-31'
  },
  {
    id: 2,
    image: 'https://picsum.photos/200/100?random=2',
    description: 'Enjoy a free coffee every week at CoffeeHouse locations.',
    validTo: '2023-12-31'
  },
  {
    id: 3,
    image: 'https://picsum.photos/200/100?random=3',
    description: 'Save 15% on FitnessPro memberships for a healthier you.',
    validTo: '2023-12-31'
  }
];

function MyDealsModal({ show, onHide }) {
  const [showRedeem, setShowRedeem] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);

  const handleRedeem = (deal) => {
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
          <div className="d-flex flex-column" style={{ gap: '20px' }}>
            {dealData.map((deal) => (
              <Card key={deal.id} className="mb-2">
                <div className="row g-0">
                  <div className="col-md-3">
                    <Card.Img variant="top" src={deal.image} alt={deal.description} className="img-fluid rounded-start p-3" />
                  </div>
                  <div className="col-md-9">
                    <Card.Body className="d-flex flex-column text-start">
                      <div>
                        <Card.Text>{deal.description}</Card.Text>
                        <Card.Text className="text-muted">
                          Valid to {deal.validTo}
                        </Card.Text>
                      </div>
                      <div className="d-flex justify-content-end align-items-center mt-3">
                        <Button className="btn-kmint-blue" onClick={() => handleRedeem(deal)}>Redeem</Button>
                      </div>
                    </Card.Body>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Modal.Body>
      </Modal>

      <OffcanvasRedeem show={showRedeem} onHide={handleCloseRedeem} deal={selectedDeal} />
    </>
  );
}

export default MyDealsModal;
