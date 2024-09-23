"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Card, ProgressBar, Row, Col, Badge, Spinner } from "react-bootstrap";
import { creditManager } from "@/contracts/CreditManager";
import { creditFacility } from "@/contracts/CreditFacility";
import { cToken } from "@/contracts/CToken";

const blockTimeSeconds = 3; // Tron blocktime
const secondsPerYear = 365 * 24 * 60 * 60;

const calculateAPY = async () => {
  try {
    const cTokenContract = await cToken();
    const borrowRatePerBlock = await cTokenContract.getBorrowRatePerBlock();
    const borrowRatePerBlockNumber = parseInt(borrowRatePerBlock, 10);
    return (
      ((1 + borrowRatePerBlockNumber / 1e18) **
        (secondsPerYear / blockTimeSeconds) -
        1) *
      100
    );
  } catch (error) {
    console.error("Error calculating APY:", error);
    return 0;
  }
};

const calculateAdjustedAPY = async (interestDeltaPB) => {
  try {
    const cTokenContract = await cToken();
    const borrowRatePerBlock = await cTokenContract.getBorrowRatePerBlock();
    const borrowRatePerBlockNumber = parseInt(borrowRatePerBlock, 10);
    const interestDeltaPBNumber = parseInt(interestDeltaPB, 10);

    const interestAccrued =
      borrowRatePerBlockNumber * (1 + interestDeltaPBNumber / 10000);
    return (
      ((1 + interestAccrued / 1e18) ** (secondsPerYear / blockTimeSeconds) -
        1) *
      100
    );
  } catch (error) {
    console.error("Error calculating adjusted APY:", error);
    return 0;
  }
};

function CreditSummary({ refresh }) {
  const [basicCreditInfo, setBasicCreditInfo] = useState({
    limit: 0,
    used: 0,
    interestRate: 0,
  });
  const [sharedCreditInfo, setSharedCreditInfo] = useState({
    score: 0,
    limit: 0,
    used: 0,
    interestRate: 0,
  });

  const userAddress = window.tronWeb.defaultAddress.base58;

  const fetchBasicCreditInfo = useCallback(async () => {
    try {
      const creditFacilityContract = await creditFacility();
      const basicLimit =
        await creditFacilityContract.calculateTotalBorrowingPower(userAddress);
      const basicUsed =
        await creditFacilityContract.calculateTotalUserStablecoinBorrows(
          userAddress
        );
      const apy = await calculateAPY();

      setBasicCreditInfo({
        limit: basicLimit,
        used: basicUsed,
        interestRate: apy.toFixed(2),
      });
    } catch (error) {
      console.error("Error fetching basic credit info:", error);
      setBasicCreditInfo({
        limit: 0,
        used: 0,
        interestRate: 0,
      });
    }
  }, [userAddress]);

  const fetchSharedCreditInfo = useCallback(async () => {
    try {
      const creditManagerContract = await creditManager();
      const creditData = await creditManagerContract.getCreditInfo(userAddress);
      const interestDeltaPB = await creditManagerContract.getInterestDeltaPB();
      const adjustedApy = await calculateAdjustedAPY(interestDeltaPB);

      setSharedCreditInfo({
        score: creditData.score,
        limit: creditData.limit,
        used: creditData.used,
        interestRate: adjustedApy.toFixed(2),
      });
    } catch (error) {
      console.error("Error fetching shared credit info:", error);
      setSharedCreditInfo({
        score: 0,
        limit: 0,
        used: 0,
        interestRate: 0,
      });
    }
  }, [userAddress]);

  useEffect(() => {
    fetchBasicCreditInfo();
    fetchSharedCreditInfo();
  }, [refresh, fetchBasicCreditInfo, fetchSharedCreditInfo]);

  const calcUsedPercentage = (used, limit) =>
    limit > 0 ? ((limit - used) / limit) * 100 : 0;
  const calcAvailable = (used, limit) =>
    limit > 0 ? parseFloat(limit - used).toFixed(2) : 0;

  const CreditCard = ({ title, data, variant }) => (
    <Card className="h-100 shadow-sm">
      <Card.Body className="d-flex flex-column">
        <Card.Title className="d-flex align-items-center mb-4">
          {/* <FontAwesomeIcon icon={icon} className={`me-2 text-${variant}`} /> */}
          {title}
        </Card.Title>
        <Row className="mb-3">
          <Col>
            <h6 className="text-muted">Credit Limit</h6>
            <h4>${data.limit}</h4>
          </Col>
          <Col>
            <h6 className="text-muted">Used Credit</h6>
            <h4>${data.used}</h4>
          </Col>
        </Row>
        <ProgressBar
          now={calcUsedPercentage(data.used, data.limit)}
          animated
          variant={variant}
          className="mb-3"
          style={{ height: "15px" }}
        />
        <div className="mt-auto">
          <h6 className="text-muted mb-2">Available Credit</h6>
          <h3 className={`text-${variant}`}>
            ${calcAvailable(data.used, data.limit)}
          </h3>
        </div>
      </Card.Body>
      <Card.Footer className="bg-transparent border-top-0">
        <Row className="align-items-center">
          <Col>
            <Badge bg={variant} className="p-2">
              {/* <FontAwesomeIcon icon={faChartLine} className="me-1" /> */}
              Borrowing Rate: {data.interestRate}% APY
            </Badge>
          </Col>
          {data.score > 0 ? (
            <Col className="text-end">
              <h5 className="mb-0">
                Credit Score:{" "}
                <Badge bg={variant} className="p-3">
                  {data.score}
                </Badge>
              </h5>
            </Col>
          ) : (
            (data.score = 0 ? (
              <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            ) : (
              <></>
            ))
          )}
        </Row>
      </Card.Footer>
    </Card>
  );

  return (
    <div className="credit-summary">
      <Row className="g-4">
        <Col md={6}>
          <CreditCard
            title="Basic Credit"
            data={basicCreditInfo}
            variant="primary"
            // icon={faPiggyBank}
          />
        </Col>
        <Col md={6}>
          <CreditCard
            title="Shared Credit"
            data={sharedCreditInfo}
            variant="success"
            // icon={faShieldAlt}
          />
        </Col>
      </Row>
      <div className="mt-4 text-center">
        {/* <FontAwesomeIcon icon={faInfoCircle} className="me-2 text-muted" /> */}
        <small className="text-muted">
          Credit information is updated every 30 seconds.
        </small>
      </div>
    </div>
  );
}

export default CreditSummary;
