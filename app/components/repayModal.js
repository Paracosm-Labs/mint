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
} from "@/lib/address";
import approveSpend from "@/lib/approveSpend";
import trc20ABI from "@/abi/trc20";
import Web3 from "web3";

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
      const tokenAddress = USDDAddress;
      const cTokenAddress = USDDcTokenAddress;

      let web3 = new Web3();
      let amount = web3.utils.toWei(String(paymentAmount), "ether");

      if (repayTo === "creditManager") {
        await approveSpend(
          CreditManagerAddress,
          amount,
          tokenAddress,
          trc20ABI
        );
        const manager = await creditManager();
        await manager.repay(tokenAddress, paymentAmount);
      } else if (repayTo === "creditFacility") {
        await approveSpend(
          CreditFacilityAddress,
          amount,
          tokenAddress,
          trc20ABI
        );
        const facility = await creditFacility();
        await facility.repay(cTokenAddress, paymentAmount, beneficiary);
      }

      console.log("Repayment submitted successfully");
      if (onSuccess) onSuccess();
      onHide();
    } catch (err) {
      console.error("Error processing repayment:", err);
      setError("Failed to process repayment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Basic Credit repays your individual debt, while Shared Credit repays the
      community's shared debt pool.
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
            <Form.Label>Payment Amount (USDD)</Form.Label>
            <div className="input-group">
              <span className="input-group-text">$</span>
              <Form.Control
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
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
          Repayments are processed in USDD. Ensure you have sufficient balance.
        </small>
      </Modal.Footer>
    </Modal>
  );
}

export default RepayModal;
