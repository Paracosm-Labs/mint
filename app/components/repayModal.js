import React, { useState } from "react";
import {
  Modal,
  Button,
  Form,
  Alert,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPiggyBank, faUsers, faMoneyBillWave, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { creditManager } from "@/contracts/CreditManager";
import { creditFacility } from "@/contracts/CreditFacility";
import {
  CreditFacilityAddress,
  CreditManagerAddress,
  USDDcTokenAddress,
  USDDAddress,
  USDTcTokenAddress,
  USDTAddress,
} from "@/lib/address";
import trc20ABI from "@/abi/trc20";
import Image from "next/image";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function RepayModal({ show, onHide, onSuccess, outstandingDebt }) {
  const [paymentAmount, setPaymentAmount] = useState("");
  const [repayTo, setRepayTo] = useState("creditFacility");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const beneficiary = window.tronWeb.defaultAddress.base58;
      const tokenAddress = USDTAddress;
      const cTokenAddress = USDTcTokenAddress;
      let tokenDecimals;
      if (tokenAddress === USDTAddress) {
        tokenDecimals = 6;
      } else {
        tokenDecimals = 18;
      }

      if (repayTo === "creditManager") {
        const manager = await creditManager();
        await manager.repay(tokenAddress, paymentAmount, tokenDecimals);
      } else if (repayTo === "creditFacility") {
        const facility = await creditFacility();
        await facility.repay(tokenAddress, paymentAmount, beneficiary, tokenDecimals);
      }

      console.log("Repayment submitted successfully");
      if (onSuccess) onSuccess();
      toast.success("Repayment submitted successfully");
      onHide();
    } catch (err) {
      console.error("Error processing repayment:", err);
      setError("Failed to process repayment. Please try again.");
      // toast.error("Failed to process repayment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Basic Credit repays your individual debt, while Shared Credit repays the
      platform&apos;s shared debt pool.
    </Tooltip>
  );

  return (
    <Modal show={show} onHide={onHide} size="md" centered>
      <Modal.Header closeButton className="bg-light">
        <Modal.Title>
          {/* <FontAwesomeIcon icon={faMoneyBillWave} className="me-2 text-success" /> */}
          Make a Repayment
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <div className="text-center mb-4">
            <h5 className="mb-3">Select Repayment Destination</h5>
            <OverlayTrigger
              placement="top"
              delay={{ show: 250, hide: 400 }}
              overlay={renderTooltip}
            >
              <div
                className="btn-group btn-group-lg"
                role="group"
                aria-label="Repay To"
              >
                <Button
                  variant={
                    repayTo === "creditFacility" ? "primary" : "outline-primary"
                  }
                  onClick={() => setRepayTo("creditFacility")}
                  className="d-flex align-items-center justify-content-center"
                >
                  {/* <FontAwesomeIcon icon={faPiggyBank} className="me-2" /> */}
                  Basic Credit
                </Button>
                <Button
                  variant={
                    repayTo === "creditManager" ? "success" : "outline-success"
                  }
                  onClick={() => setRepayTo("creditManager")}
                  className="d-flex align-items-center justify-content-center"
                >
                  {/* <FontAwesomeIcon icon={faUsers} className="me-2" /> */}
                  Shared Credit
                </Button>
              </div>
            </OverlayTrigger>
          </div>
          <Form.Group className="mb-4">
            <Form.Label>Payment Amount 
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
                value={paymentAmount}
                onChange={(e) => {
                  const value = e.target.value;

                  // Check if the input is a valid number or a decimal
                  if (!isNaN(value) && value.match(/^\d*\.?\d*$/)) {
                    setPaymentAmount(value); // Only set valid decimal values
                  }
                }}
                required
                min="0"
                max={outstandingDebt}
              />
            </div>
            {outstandingDebt && (
              <Form.Text className="text-muted">
                Outstanding debt: ${outstandingDebt}
              </Form.Text>
            )}
          </Form.Group>
          {error && <Alert variant="danger">{error}</Alert>}
          <div className="d-flex justify-content-between align-items-center">
            <Button variant="outline-secondary" onClick={onHide}>
              Cancel
            </Button>
            <Button
              variant="success"
              type="submit"
              disabled={loading || !paymentAmount}
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
                  {/* <FontAwesomeIcon icon={faMoneyBillWave} className="me-2" /> */}
                  Make Repayment
                </>
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer className="bg-light">
        <small className="text-muted">
          {/* <FontAwesomeIcon icon={faInfoCircle} className="me-1" /> */}
          Repayments are processed in USDT. Ensure you have sufficient balance.
        </small>
      </Modal.Footer>
    </Modal>
  );
}

export default RepayModal;
