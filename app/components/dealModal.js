"use client";
import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { createDeal } from "@/lib/deal";
import { useAuth } from "@/lib/AuthContext";
import { getClubIdFromEvent } from "@/lib/club";

function DealModal({ show, onHide, deal }) {
  const { data } = useAuth();
  const [dealImage, setDealImage] = useState(deal?.image || "");
  const [maxSupply, setMaxSupply] = useState("");
  const [dealDescription, setDealDescription] = useState("");
  const [dealValidTo, setDealValidTo] = useState("");

  const save = async (txID, description) => {
    if (!txID) {
      throw Error("txID is null");
    }
    let payload = {
      description: description,
      txID: txID,
      owner: data.userData.user._id,
      business: data.userData.businesses._id,
      club: data.userData.clubs._id,
    };
    const response = await fetch("/api/deal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const resJson = await response.json();
    if (response.status == 200) {
      return resJson;
    }
    if (response.status != 200) {
      console.error(resJson.error);
      return null;
    }
  };

  const saveDeal = async () => {
    const clubId = await getClubIdFromEvent(data.userData.clubs.txID);
    console.log("clubId", clubId);

    const txID = await createDeal(clubId, maxSupply, dealValidTo, "", 5);
    console.log("deal txID", txID);

    let resJson = await save(txID, dealDescription);

    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} size="md" centered>
      <Modal.Header closeButton>
        <Modal.Title>{deal ? "Edit Deal" : "Create New Deal"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* <Form.Group className="mb-3">
            <Form.Label>Deal Image</Form.Label>
            <Form.Control type="file" value={dealImage} onChange={(e) => setDealImage(e.target.value)} />
          </Form.Group> */}
          <Form.Group className="mb-3">
            <Form.Label>Max Supply</Form.Label>
            <Form.Control
              type="text"
              value={maxSupply}
              onChange={(e) => setMaxSupply(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={dealDescription}
              onChange={(e) => setDealDescription(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Valid To</Form.Label>
            <Form.Control
              type="date"
              value={dealValidTo}
              onChange={(e) => setDealValidTo(e.target.value)}
            />
          </Form.Group>
          <div className="text-end">
            <Button
              variant="outline-secondary"
              onClick={onHide}
              className="me-2"
            >
              Cancel
            </Button>
            <Button
              className="btn btn-kmint-blue"
              type="button"
              onClick={saveDeal}
            >
              {deal ? "Update Deal" : "Create Deal"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default DealModal;
