import React, { useEffect, useState } from "react";
import { Card, Table, Badge, Spinner } from "react-bootstrap";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faHistory, faMoneyBillWave, faExchangeAlt, faPiggyBank, faUsers } from '@fortawesome/free-solid-svg-icons';
import { creditManager } from "@/contracts/CreditManager";
import { creditFacility } from "@/contracts/CreditFacility";
import Link from "next/link";
import EmptyState from "../components/emptyState";

function CreditUsageHistory({ refresh }) {
  const [usageHistory, setUsageHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCreditUsageHistory = async () => {
    try {
      setLoading(true);
      const creditManagerInstance = await creditManager();
      const creditFacilityInstance = await creditFacility();
      const managerBorrowedEvents =
        await creditManagerInstance.getBorrowedEvents(5);
      const facilityBorrowedEvents =
        await creditFacilityInstance.getBorrowedEvents(5);
      const managerRepaymentEvents =
        await creditManagerInstance.getLoanRepaymentEvents(5);
      const facilityRepaymentEvents =
        await creditFacilityInstance.getRepaymentEvents(5);

      // Combine and format events
      const combinedEvents = [
        ...managerBorrowedEvents.map((event) => ({
          id: event.txId,
          date: new Date(event.txDate).toISOString(),
          amount: event.amount,
          type: "Borrowed",
          source: "Shared Credit",
        })),
        ...facilityBorrowedEvents.map((event) => ({
          id: event.txId,
          date: new Date(event.txDate).toISOString(),
          amount: event.amount,
          type: "Borrowed",
          source: "Basic Credit",
        })),
        ...managerRepaymentEvents.map((event) => ({
          id: event.txId,
          date: new Date(event.txDate).toISOString(),
          amount: event.amount,
          type: "Repayment",
          source: "Shared Credit",
        })),
        ...facilityRepaymentEvents.map((event) => ({
          id: event.txId,
          date: new Date(event.txDate).toISOString(),
          amount: event.amount,
          type: "Repayment",
          source: "Basic Credit",
        })),
      ];

      // Create a Map to store unique events, giving preference to repayment events from credit manager
      const uniqueEventsMap = new Map();

      combinedEvents.forEach((event) => {
        const existingEvent = uniqueEventsMap.get(event.id);
        if (
          !existingEvent /*||
          (event.type === "Repayment" && event.source === "Shared Credit")*/
        ) {
          uniqueEventsMap.set(event.id, event);
        }
      });

      // Convert Map back to array and sort by date descending
      const uniqueEvents = Array.from(uniqueEventsMap.values());
      uniqueEvents.sort((a, b) => new Date(b.date) - new Date(a.date));

      setUsageHistory(uniqueEvents);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreditUsageHistory();
  }, [refresh]);

  const getSourceIcon = (source) => {
    return source === "Manager" ? faUsers : faPiggyBank;
  };

  const getTypeIcon = (type) => {
    return type === "Borrowed" ? faMoneyBillWave : faExchangeAlt;
  };

  const getTypeBadgeVariant = (type) => {
    return type === "Borrowed" ? "warning" : "success";
  };

  return (
    <Card className="shadow-sm mt-3">
      <Card.Header className="bg-light d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          {/* <FontAwesomeIcon icon={faHistory} className="me-2 text-primary" /> */}
          Credit Usage History
        </h5>
      </Card.Header>
      <Card.Body>
        {loading ? (
          <div className="text-center my-4">
            <Spinner animation="border" role="status" variant="primary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : error ? (
          <div className="alert alert-danger" role="alert">
            Error: {error}
          </div>
        ) : (
          <div className="table-responsive">
            <Table hover className="align-middle">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Type</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody>
                {usageHistory.map((item) => (
                  <tr key={item.id}>
                    <td>{new Date(item.date).toLocaleString()}</td>
                    <td>
                      <span
                        className={`fw-bold ${
                          item.type === "Borrowed"
                            ? "text-danger"
                            : "text-success"
                        }`}
                      >
                        $
                        {parseFloat(item.amount).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </td>
                    <td>
                      <Badge
                        bg={getTypeBadgeVariant(item.type)}
                        className="d-flex align-items-center"
                        style={{ width: "fit-content" }}
                      >
                        {/* <FontAwesomeIcon icon={getTypeIcon(item.type)} className="me-1" /> */}
                        {item.type}
                      </Badge>
                    </td>
                    <td>
                      <Badge
                        bg="secondary"
                        className="d-flex align-items-center"
                        style={{ width: "fit-content" }}
                      >
                        {/* <FontAwesomeIcon icon={getSourceIcon(item.source)} className="me-1" /> */}
                        {item.source}
                      </Badge>
                      <Link
                        href={`https://nile.tronscan.org/#/transaction/${item.id}`}
                        target="_blank"
                      >
                        <span className="text-muted">View Details</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default CreditUsageHistory;
