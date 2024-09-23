import React from 'react';
import Image from "next/image";

const CurrencySelector = ({ selectedCurrency, setSelectedCurrency }) => {
  return (
    <div className="btn-group d-flex" role="group" aria-label="Currency selection">
      {['USDT', 'USDD'].map((currency) => (
        <React.Fragment key={currency}>
          <input
            type="radio"
            className="btn-check"
            name="currency"
            id={currency.toLowerCase()}
            checked={selectedCurrency === currency}
            onChange={() => setSelectedCurrency(currency)}
            autoComplete="off"
          />
          <label className="btn btn-outline-success" htmlFor={currency.toLowerCase()}>
            <Image
              src={`/${currency.toLowerCase()}.png`}
              alt={currency}
              width= {24}
              height={24}
              style={{ marginRight: '4px' }}
            />
            {currency}
          </label>
        </React.Fragment>
      ))}
    </div>
  );
};

export default CurrencySelector;
