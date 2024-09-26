import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import CurrencySelector from './currencySelector';
import Image from "next/image";

const JoinClubModal = ({ show, onHide, club, selectedCurrency, setSelectedCurrency, onJoin }) => {
  const [loading, setLoading] = useState(false); // Loading state to handle button behavior

  const handleJoinClick = async () => {
    setLoading(true);  // Start loading when the user clicks Join
    try {
      await onJoin(); // Call the onJoin function
    } catch (error) {

    } finally {
      setLoading(false); // Stop loading when transaction completes
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="border-0">
        <Modal.Title as="h4" className="w-100 text-center">{club?.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="px-4">
        <div className="row">
          <div className="col-md-6">
            <Image
              src={club?.image || "/placeholder.jpg"}
              className="img-fluid rounded-3 mb-3 w-100"
              alt={club?.name}
              height={200}
              width={300}
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
          <CurrencySelector
            selectedCurrency={selectedCurrency}
            setSelectedCurrency={setSelectedCurrency}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer className="border-1 justify-content-center">
        <Button variant="outline-secondary" onClick={onHide} className="px-4" disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="success"
          onClick={handleJoinClick}
          className="px-4"
          disabled={loading}
        >
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Processing...
            </>
          ) : (
            <>
              Join for ${club?.membershipFee}
              <Image
                src={`/${selectedCurrency.toLowerCase()}.png`}
                alt={selectedCurrency}
                width={24}
                height={24}
                style={{ marginRight: '4px', marginLeft: '4px' }}
              />
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default JoinClubModal;
