// components/dealModal.js
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function DealModal({ show, onHide, deal }) {
  const [dealImage, setDealImage] = useState(deal?.image || '');
  const [maxSupply, setMaxSupply] = useState(deal?.maxSupply || '');
  const [dealDescription, setDealDescription] = useState(deal?.description || '');
  const [dealValidTo, setDealValidTo] = useState(deal?.validTo || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Submitting deal:', {
      image: dealImage,
      maxSupply: maxSupply,
      description: dealDescription,
      validTo: dealValidTo
    });
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} size="md" centered>
      <Modal.Header closeButton>
        <Modal.Title>{deal ? 'Edit Deal' : 'Create New Deal'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Deal Image</Form.Label>
            <Form.Control type="file" value={dealImage} onChange={(e) => setDealImage(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Max Supply</Form.Label>
            <Form.Control type="text" value={maxSupply} onChange={(e) => setMaxSupply(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={3} value={dealDescription} onChange={(e) => setDealDescription(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Valid To</Form.Label>
            <Form.Control type="date" value={dealValidTo} onChange={(e) => setDealValidTo(e.target.value)} />
          </Form.Group>
          <div className="text-end">
            <Button variant="outline-secondary" onClick={onHide} className="me-2">
              Cancel
            </Button>
            <Button className='btn btn-kmint-blue' type="submit">
              {deal ? 'Update Deal' : 'Create Deal'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default DealModal;