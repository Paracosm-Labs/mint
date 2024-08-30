// components/redemptionChart.js
import React from 'react';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', redemptions: 400 },
  { name: 'Feb', redemptions: 300 },
  { name: 'Mar', redemptions: 500 },
  { name: 'Apr', redemptions: 450 },
  { name: 'May', redemptions: 600 },
  { name: 'Jun', redemptions: 550 },
];

function RedemptionChart() {
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Redemption Trend</h5>
        {/* <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="redemptions" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer> */}
      </div>
    </div>
  );
}

export default RedemptionChart;