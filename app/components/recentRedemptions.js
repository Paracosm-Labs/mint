// components/recentRedemptions.js
import React from 'react';

const recentRedemptionsData = [
  { date: '2023-05-15', customer: 'Tx...8oPx', amount: '$50.00' },
  { date: '2023-05-14', customer: 'Tx...8oox', amount: '$25.00' },
  { date: '2023-05-13', customer: 'Tx...8oPr', amount: '$100.00'},
];

function RecentRedemptions() {
  return (
    <div className="card mb-4">
      <div className="card-body">
        <h5 className="card-title">Recent Redemptions</h5>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Customer</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentRedemptionsData.map((redemption, index) => (
                <tr key={index}>
                  <td>{redemption.date}</td>
                  <td>{redemption.customer}</td>
                  <td>{redemption.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default RecentRedemptions;