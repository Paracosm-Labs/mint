import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { createDeal } from "@/lib/deal";
import { useAuth } from "@/lib/AuthContext";
import { getClubIdFromEvent } from "@/lib/club";
import Upload from "./upload";
import Image from "next/image";

function DealModal({ show, onHide, deal }) {
  const { data } = useAuth();
  const [dealImage, setDealImage] = useState(deal?.image || "");
  const [maxSupply, setMaxSupply] = useState(deal?.maxSupply || "");
  const [dealDescription, setDealDescription] = useState(
    deal?.description || ""
  );
  const [dealValidTo, setDealValidTo] = useState(deal?.validTo || "");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [url, setUrl] = useState();

  const validateForm = () => {
    const newErrors = {};
    if (!maxSupply) newErrors.maxSupply = "Max supply is required";
    if (!dealDescription) newErrors.dealDescription = "Description is required";
    if (!dealValidTo) newErrors.dealValidTo = "Valid to date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = maxSupply && dealDescription && dealValidTo;

  const save = async (txID, description, imageUrl) => {
    if (!txID) {
      throw Error("txID is null");
    }
    debugger;
    let payload = {
      description: description,
      txID: txID,
      image: imageUrl,
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
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const clubId = await getClubIdFromEvent(data.userData.clubs.txID);
      console.log("clubId", clubId);

      let metadataName = data.userData.businesses.name;

      let metadataUri = {
        description: dealDescription,
        external_url: "https://mintdeals/deals/",
        image: url,
        name: metadataName,
      };

      const txID = await createDeal(
        clubId,
        maxSupply,
        dealValidTo,
        JSON.stringify(metadataUri),
        5
      );
      console.log("deal txID", txID);

      let resJson = await save(txID, dealDescription, url);

      onHide();
    } catch (error) {
      console.error("Error saving deal:", error);
      // Here you might want to show an error message to the user
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="md" centered>
      <Modal.Header closeButton>
        <Modal.Title>{deal ? "Edit Deal" : "Create New Deal"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate>
          <Form.Group className="mb-3">
            <Form.Label>Upload Image</Form.Label>
            <Upload setImageUrl={setUrl}></Upload>
            {url && (
              <div className="mt-3">
                {/** style accordingy */}
                <Image
                  loader={() => url}
                  // fill={true}
                  width={200}
                  height={200}
                  src={url}
                  alt="Uploaded Image"
                />
              </div>
            )}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Max Supply</Form.Label>
            <Form.Control
              type="number"
              value={maxSupply}
              onChange={(e) => setMaxSupply(e.target.value)}
              isInvalid={!!errors.maxSupply}
            />
            <Form.Control.Feedback type="invalid">
              {errors.maxSupply}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={dealDescription}
              onChange={(e) => setDealDescription(e.target.value)}
              isInvalid={!!errors.dealDescription}
            />
            <Form.Control.Feedback type="invalid">
              {errors.dealDescription}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Valid To</Form.Label>
            <Form.Control
              type="date"
              value={dealValidTo}
              onChange={(e) => setDealValidTo(e.target.value)}
              isInvalid={!!errors.dealValidTo}
            />
            <Form.Control.Feedback type="invalid">
              {errors.dealValidTo}
            </Form.Control.Feedback>
          </Form.Group>
          <div className="text-end">
            <Button
              variant="outline-secondary"
              onClick={onHide}
              className="me-2"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              className="btn btn-kmint-blue"
              type="button"
              onClick={saveDeal}
              disabled={!isFormValid || isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  {deal ? "Updating..." : "Creating..."}
                </>
              ) : deal ? (
                "Update Deal"
              ) : (
                "Create Deal"
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default DealModal;
