// components/CreditUsageHistory.js
import React from 'react';

function CreditUsageHistory() {
  // Sample data - replace with actual data fetching logic
  const usageHistory = [
    { id: 1, date: '2023-05-20', amount: 5000, status: 'Approved' },
    { id: 2, date: '2023-04-15', amount: 10000, status: 'Repaid' },
  ];


  return (
    <div className="row">
      <div className="col-md-12">
        <h3>Credit Usage History</h3>
        <div className="table-responsive">
          <table className="table table-striped table-sm">
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {usageHistory.map((item) => (
                <tr key={item.id}>
                  <td>{item.date}</td>
                  <td>${item.amount.toLocaleString()}</td>
                  <td>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default CreditUsageHistory;