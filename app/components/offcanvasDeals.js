import React from 'react';
import { Offcanvas, Card, Button } from 'react-bootstrap';

const sampleDealData = [
  {
    id: 1,
    image: 'https://picsum.photos/200/100?random=1',
    description: 'Save 20% on all electronics purchases at TechStore.',
    validTo: '2023-08-31'
  },
  {
    id: 2,
    image: 'https://picsum.photos/200/100?random=2',
    description: 'Enjoy a free coffee every week at participating CoffeeHouse locations.',
    validTo: '2023-12-31'
  },
  {
    id: 3,
    image: 'https://picsum.photos/200/100?random=3',
    description: 'Get a 15% discount on FitnessPro club memberships.',
    validTo: '2023-12-31'
  }
];

function OffcanvasDeals({ show, onHide, club }) {
  return (
    <Offcanvas show={show} onHide={onHide} placement="bottom" className="kmint-deals">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>{club ? club.name : 'Deals'}</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {club ? (
          <div className="d-flex overflow-auto" style={{ gap: '10px' }}>
            {sampleDealData.map((deal) => (
              <Card key={deal.id} style={{ minWidth: '350px', maxWidth: '350px' }} className="flex-shrink-0">
                <Card.Img variant="top" src={deal.image} alt={deal.description} />
                <Card.Body className="d-flex flex-column align-items-center">
                  <Card.Text style={{ minHeight: '60px' }}>{deal.description}</Card.Text>
                  <Card.Text className="text-muted">Valid to {deal.validTo}</Card.Text>
                  <div className='w-100 text-center'>
                    <Button className="btn-kmint-blue mb-2">Mint Now</Button>
                    <p className='text-muted'>$2 Service Fee</p>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        ) : (
            <div className='w-100 text-center'>
            <p>No deals available</p>
            </div>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default OffcanvasDeals;
