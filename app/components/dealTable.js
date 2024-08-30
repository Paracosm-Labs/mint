import React, { useState } from 'react';
import { Table, Button } from 'react-bootstrap';

function DealTable({ onEdit }) {
  // Sample data - replace with actual data fetching logic
  const [deals, setDeals] = useState([
    {
      id: 1,
      image: 'https://via.placeholder.com/200x150',
      supply: 250,
      minted: 50,
      description: '20% off on summer items',
      validFrom: '2023-06-01',
      validTo: '2023-08-31',
    },
    {
      id: 2,
      image: 'https://via.placeholder.com/200x150',
      supply: 250,
      minted: 20,
      description: '15% off on winter apparel',
      validFrom: '2023-11-01',
      validTo: '2023-12-31',
    },
    {
      id: 3,
      image: 'https://via.placeholder.com/200x150',
      supply: 250,
      minted: 0,
      description: '75% off on spring apparel',
      validFrom: '2023-11-01',
      validTo: '2023-12-31',
    }
  ]);

  return (
    <div className="table-responsive">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th></th>
            <th>Supply/Minted</th>
            <th>Description</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {deals.map((deal) => (
            <tr key={deal.id}>
              <td><img src={deal.image} alt={deal.description} width="100" /></td>
              <td>{deal.supply}/{deal.minted}</td>
              <td>{deal.description}
                <p className='text-muted text-small'>Valid Thru: {deal.validFrom} - {deal.validTo}</p>
              </td>
              <td>
                {deal.minted === 0 && (
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2 w-100"
                    onClick={() => onEdit(deal)}
                  >
                    Edit
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default DealTable;
