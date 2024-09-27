// components/creditSummary.js
"use client";
import React from "react";
import { Card, ProgressBar, Row, Col, Badge, Spinner } from "react-bootstrap";

const CreditSummary = ({ basicCreditInfo, sharedCreditInfo }) => {
  const calcUsedPercentage = (used, limit) =>
    limit > 0 ? ((limit - used) / limit) * 100 : 0;
    
  const calcAvailable = (used, limit) =>
    limit > 0 ? parseFloat(limit - used).toFixed(2) : 0;

  const CreditCard = ({ title, data, variant }) => (
    <Card className="h-100 shadow-sm">
      <Card.Body className="d-flex flex-column">
        <Card.Title className="d-flex align-items-center mb-4">
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
              Borrowing Rate: {data.interestRate}% APY
            </Badge>
          </Col>
          {data.title === "Shared Credit" ? (
            data.score > 0 ? (
              <Col className="text-end">
                <h5 className="mb-0">
                  Credit Score:{" "}
                  <Badge bg={variant} className="p-3">
                    {data.score}
                  </Badge>
                </h5>
              </Col>
            ) : (
              <Col className="text-end">
                <Spinner animation="border" role="status" variant="primary">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </Col>
            )
          ) : null}
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
          />
        </Col>
        <Col md={6}>
          <CreditCard
            title="Shared Credit"
            data={sharedCreditInfo}
            variant="success"
          />
        </Col>
      </Row>
      <div className="mt-4 text-center">
        <small className="text-muted">
          Credit information is updated every ~60 seconds.
        </small>
      </div>
    </div>
  );
};

export default CreditSummary;
