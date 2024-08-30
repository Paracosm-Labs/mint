// components/redemptionsTable.js
import React from 'react';

function RedemptionsTable() {
  // Sample data - replace with actual data fetching logic
  const redemptions = [
    { id: 1, date: '2023-05-20', customer: 'Tx...8oPx', amount: '$50.00', status: 'Completed' },
    { id: 2, date: '2023-05-19', customer: 'Tx...tp9x', amount: '$30.00', status: 'Pending' },
    { id: 2, date: '2023-05-19', customer: 'Tx...7ogc', amount: '$30.00', status: 'Pending' },
  ];

  return (
    <div className="table-responsive">
      <table className="table table-striped table-sm">
        <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Customer</th>
            <th>Amount</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {redemptions.map((redemption) => (
            <tr key={redemption.id}>
              <td>{redemption.id}</td>
              <td>{redemption.date}</td>
              <td>{redemption.customer}</td>
              <td>{redemption.amount}</td>
              <td>{redemption.status}</td>
              <td>
                <button className="btn btn-sm btn-outline-secondary">Approve</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RedemptionsTable;