import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const JoinClubModal = ({ show, onHide, club, selectedCurrency, setSelectedCurrency, onJoin }) => {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="border-0">
        <Modal.Title as="h4" className="w-100 text-center">{club?.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4">
        <div className="row">
          <div className="col-md-6">
            <img
              src={club?.image || "/api/placeholder/400/300"}
              className="img-fluid rounded-3 mb-3"
              alt={club?.name}
            />
          </div>
          <div className="col-md-6">
            <h5 className="mb-3 d-flex align-items-center">
              Membership Fee: <span className="ms-2 text-success fw-bold">${club?.membershipFee}</span>
            </h5>
            <p className="mb-3 d-flex align-items-center">
              {club?.category} |&nbsp;{club?.country} |&nbsp;<strong>{club?.members}</strong>&nbsp;Members
            </p>
            <div className="mt-3">
                <h6 className="fw-bold mb-2">About this Club</h6>
                <p>{club?.description}</p>
            </div>
          </div>
        </div>

        <Form.Group className="mt-4">
          <h6 className="fw-bold mb-2 text-center">Select Payment Currency</h6>
          <div className="btn-group d-flex" role="group" aria-label="Currency selection">
            {['USDT', 'USDD'].map((currency) => (
              <React.Fragment key={currency}>
                <input
                  type="radio"
                  className="btn-check"
                  name="currency"
                  id={currency.toLowerCase()}
                  checked={selectedCurrency === currency}
                  onChange={() => setSelectedCurrency(currency)}
                  autoComplete="off"
                />
                <label className="btn btn-outline-primary" htmlFor={currency.toLowerCase()}>
                  {currency}
                </label>
              </React.Fragment>
            ))}
          </div>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer className="border-1 justify-content-center">
        <Button variant="outline-secondary" onClick={onHide} className="px-4">
          Cancel
        </Button>
        <Button variant="success" onClick={onJoin} className="px-4">
          Join with {selectedCurrency}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default JoinClubModal;