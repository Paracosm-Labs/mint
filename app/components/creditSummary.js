// components/CreditSummary.js
import React from 'react';
import { Card, ProgressBar, Row, Col } from 'react-bootstrap';

function CreditSummary() {
  // Sample data - replace with actual data fetching logic
  const creditInfo = {
    limit: 10000,
    used: 7500,
    available: 2500,
    currencySymbol: '$',
    interestRate: 5.25
  };

  const usedPercentage = (creditInfo.used / creditInfo.limit) * 100;

  return (
    <Row className="mb-4">
      <Col md={8}>
        <Card>
          <Card.Body>
            <Card.Title>Current Credit Balance</Card.Title>
            <ProgressBar 
              now={usedPercentage} 
              animated
              variant="success" 
              className="mb-2"
              style={{ height: '23px' }}
            />
            <p className="mb-1">
              Your current credit balance: 
              <strong className="text-warning"> {creditInfo.currencySymbol}{creditInfo.used.toLocaleString()}</strong> / 
              <strong className="text-success"> {creditInfo.currencySymbol}{creditInfo.limit.toLocaleString()}</strong>
            </p>
            <p className="mb-4">
              Available credit: 
              <strong className="text-success"> {creditInfo.currencySymbol}{creditInfo.available.toLocaleString()}</strong>
            </p>
          </Card.Body>
        </Card>
      </Col>
      <Col md={4}>
        <Card>
          <Card.Body>
            <Card.Title>Current Interest Rate</Card.Title>
            <p className="display-4 mb-0">{creditInfo.interestRate}%</p>
            <p className="text-muted">Borrowing APY</p>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default CreditSummary;