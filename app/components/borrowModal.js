import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Form,
  Alert,
  ProgressBar,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPiggyBank, faUsers, faDollarSign, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { creditManager } from "@/contracts/CreditManager";
import { creditFacility } from "@/contracts/CreditFacility";
import {
  USDDcTokenAddress,
  USDDAddress,
  USDTcTokenAddress,
  USDTAddress,
} from "@/lib/address";
import Image from "next/image";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function BorrowModal({ show, onHide, onSuccess, availableCredit }) {
  const [borrowAmount, setBorrowAmount] = useState("");
  // const [purpose, setPurpose] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [borrowFrom, setBorrowFrom] = useState("creditFacility");
  const [utilizationPercentage, setUtilizationPercentage] = useState(0);

  useEffect(() => {
    if (borrowAmount && availableCredit) {
      const percentage = (parseFloat(borrowAmount) / availableCredit) * 100;
      setUtilizationPercentage(Math.min(percentage, 100));
    } else {
      setUtilizationPercentage(0);
    }
  }, [borrowAmount, availableCredit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const tokenAddress = USDTAddress;
      const cTokenAddress = USDTcTokenAddress;
      let tokenDecimals;
      if (tokenAddress === USDTAddress) {
        tokenDecimals = 6;
      } else {
        tokenDecimals = 18;
      }
      if (borrowFrom === "creditManager") {
        const manager = await creditManager();
        await manager.borrow(tokenAddress, borrowAmount, tokenDecimals);
      } else if (borrowFrom === "creditFacility") {
        const facility = await creditFacility();
        await facility.borrow(cTokenAddress, borrowAmount, tokenDecimals);
      }

      console.log("Borrow request submitted successfully");
      if (onSuccess) onSuccess();
      toast.success("Borrow request submitted successfully");
      onHide();
    } catch (err) {
      console.error("Error borrowing tokens:", err);
      setError("Failed to borrow tokens. Please try again.");
      // toast.error("Failed to borrow tokens. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Basic Credit uses your individual credit limit, while Shared Credit
      utilizes the platform&apos;s shared credit pool.
    </Tooltip>
  );

  return (
    <Modal show={show} onHide={onHide} size="md" centered>
      <Modal.Header closeButton className="bg-light">
        <Modal.Title>
          {/* <FontAwesomeIcon icon={faDollarSign} className="me-2 text-success" /> */}
          Borrow Funds
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <div className="text-center mb-4">
            <h5 className="mb-3">Select Borrowing Source</h5>
            <OverlayTrigger
              placement="top"
              delay={{ show: 250, hide: 400 }}
              overlay={renderTooltip}
            >
              <div
                className="btn-group btn-group-lg"
                role="group"
                aria-label="Borrow From"
              >
                <Button
                  variant={
                    borrowFrom === "creditFacility"
                      ? "primary"
                      : "outline-primary"
                  }
                  onClick={() => setBorrowFrom("creditFacility")}
                  className="d-flex align-items-center"
                >
                  {/* <FontAwesomeIcon icon={faPiggyBank} className="me-2" /> */}
                  Basic Credit
                </Button>
                <Button
                  variant={
                    borrowFrom === "creditManager"
                      ? "success"
                      : "outline-success"
                  }
                  onClick={() => setBorrowFrom("creditManager")}
                  className="d-flex align-items-center"
                >
                  {/* <FontAwesomeIcon icon={faUsers} className="me-2" /> */}
                  Shared Credit
                </Button>
              </div>
            </OverlayTrigger>
          </div>
          <Form.Group className="mb-4">
            <Form.Label>Borrow Amount 
              <Image
                src={`/usdt.png`}
                alt={'USDT'}
                width={24}
                height={24}
                style={{ marginLeft: '4px' }}
              />
              
            </Form.Label>
            <div className="input-group">
              <span className="input-group-text">$</span>
              <Form.Control
                type="text"
                value={borrowAmount}
                onChange={(e) => {
                  const value = e.target.value;

                  // Check if the input is a valid number or a decimal
                  if (!isNaN(value) && value.match(/^\d*\.?\d*$/)) {
                    setBorrowAmount(value); // Only set valid decimal values
                  }
                }}
                required
                min="0"
                max={availableCredit}
              />
            </div>
            <Form.Text className="text-muted">
              Available credit: ${availableCredit}
            </Form.Text>
            <ProgressBar
              now={utilizationPercentage}
              variant={
                utilizationPercentage > 80
                  ? "danger"
                  : utilizationPercentage > 50
                  ? "warning"
                  : "success"
              }
              className="mt-2"
            />
            <small className="text-muted">
              Credit Utilization: {utilizationPercentage.toFixed(2)}%
            </small>
          </Form.Group>
          {/* <Form.Group className="mb-4 d-none">
            <Form.Label>Purpose of Borrowing</Form.Label>
            <Form.Select 
              value={purpose}
              // onChange={(e) => setPurpose(e.target.value)}
              
            >
              <option value="">Select a purpose</option>
              <option value="inventory">Inventory Purchase</option>
              <option value="equipment">Equipment Purchase</option>
              <option value="marketing">Marketing Campaign</option>
              <option value="expansion">Business Expansion</option>
              <option value="other">Other</option>
            </Form.Select>
          </Form.Group> */}
          {error && <Alert variant="danger">{error}</Alert>}
          <div className="d-flex justify-content-between align-items-center">
            <Button variant="outline-secondary" onClick={onHide}>
              Cancel
            </Button>
            <Button
              variant="success"
              type="submit"
              disabled={loading || !borrowAmount}
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
                  {/* <FontAwesomeIcon icon={faDollarSign} className="me-2" /> */}
                  Borrow Funds
                </>
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer className="bg-light">
        <small className="text-muted">
          {/* <FontAwesomeIcon icon={faInfoCircle} className="me-1" /> */}
          Ensure you understand the terms before borrowing.
        </small>
      </Modal.Footer>
    </Modal>
  );
}

export default BorrowModal;
