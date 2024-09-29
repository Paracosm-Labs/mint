// components/dealModal.js
import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { createDeal } from "@/lib/deal";
import { useAuth } from "@/lib/AuthContext";
import { getClubIdFromEvent } from "@/lib/club";
import Upload from "./upload";
import Image from "next/image";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  // Function to reset all form fields
  const resetFields = () => {
    setDealImage("");
    setMaxSupply("");
    setDealDescription("");
    setDealValidTo("");
    setUrl("");
    setErrors({});
  };

  const handleClose = () => {
    resetFields(); // Reset the fields when modal is closed
    onHide(); // Call the onHide prop to close the modal
  };

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
    let payload = {
      description: description,
      txID: txID,
      image: imageUrl.url,
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

  // const saveDeal = async () => {
  //   if (!validateForm()) return;

  //   setIsLoading(true);
  //   try {
  //     const clubId = await getClubIdFromEvent(data.userData.clubs.txID);
  //     console.log("clubId", clubId);

  //     let metadataName = data.userData.businesses.name;

  //     let metadataUri = {
  //       description: dealDescription,
  //       external_url: "https://mintdeals.vercel.app/",
  //       image: url.url,
  //       name: metadataName,
  //     };

  //     const txID = await createDeal(
  //       clubId,
  //       maxSupply,
  //       dealValidTo,
  //       JSON.stringify(metadataUri),
  //       5
  //     );
  //     console.log("deal txID", txID);

  //     let resJson = await save(txID, dealDescription, url);
  //     toast.success("Deal created successfully!");
  //     handleClose();
  //   } catch (error) {
  //     console.error("Error saving deal:", error);
  //      toast.error("Failed to create the deal. Please try again.");

  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const saveDeal = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const clubId = await getClubIdFromEvent(data.userData.clubs.txID);
      console.log("clubId", clubId);

      let metadataName = data.userData.businesses.name;

      // Create metadata object
      let metadataUri = {
        description: dealDescription,
        external_url: "https://mintdeals.vercel.app/",
        image: url.url, // Assuming `url` comes from image upload
        name: metadataName,
      };

      // Convert metadata to JSON file
      const jsonBlob = new Blob([JSON.stringify(metadataUri)], {
        type: "application/json",
      });
      const jsonFile = new File([jsonBlob], "metadata.json");

      // Upload the JSON file to Pinata using the existing API
      const formData = new FormData();
      formData.append("file", jsonFile);

      const uploadRequest = await fetch("/api/files", {
        method: "POST",
        body: formData,
      });

      const pinataResponse = await uploadRequest.json();
      const metadataUrl = pinataResponse.url;

      console.log("Metadata CID:", metadataUrl);

      // Use the CID from Pinata for your on-chain deal creation
      const txID = await createDeal(
        clubId,
        maxSupply,
        dealValidTo,
        metadataUrl,
        5
      );
      console.log("deal txID", txID);

      // Save the deal and show success notification
      let resJson = await save(txID, dealDescription, url);
      toast.success("Deal created successfully!");
      handleClose();
    } catch (error) {
      console.error("Error saving deal:", error);
      toast.error("Failed to create the deal. Please try again.");
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
              <div className="mt-3 text-center">
                {/** style accordingy */}
                <Image
                  loader={() => url.url}
                  // fill={true}
                  width={400}
                  height={200}
                  src={url.url}
                  alt="Uploaded Deal Image"
                  className="deal-image-preview-a rounded"
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
