// // app/components/currencySelector.js
import React, { useEffect, useState } from 'react';
import Image from "next/image";
import { USDDAddress, USDTAddress } from "../../lib/address";
// import TronWeb from 'tronweb'; // Import TronWeb for balance fetching

const CurrencySelector = ({ selectedCurrency, setSelectedCurrency }) => {
  const [balance, setBalance] = useState(0);

  // Fetch balance of the selected currency when it changes
  useEffect(() => {
    const fetchBalance = async () => {
      if (window.tronWeb && window.tronWeb.ready) {
        try {
          const tronWeb = window.tronWeb;
          const userAddress = window.tronWeb.defaultAddress.base58;
          let balance = 0;

          if (selectedCurrency === 'USDT') {
            const usdtContract = await tronWeb.contract().at(USDTAddress);
            balance = await usdtContract.balanceOf(userAddress).call();
            setBalance(balance / (10 ** 6));
          } else if (selectedCurrency === 'USDD') {
            const usddContract = await tronWeb.contract().at(USDDAddress);
            balance = await usddContract.balanceOf(userAddress).call();
            setBalance(balance / (10 ** 18));
            // setBalance(tronWeb.fromSun(balance));
          } else {
            balance = await tronWeb.trx.getBalance(userAddress);
            setBalance(tronWeb.fromSun(balance));
          }

          // onBalanceChange(balance); // Notify parent about balance change
        } catch (error) {
          console.error('Error fetching balance:', error);
          setBalance(0);
          // onBalanceChange(0);
        }
      }
    };

    fetchBalance();
  }, [selectedCurrency]);

  return (
    <div className="btn-group row d-flex" role="group" aria-label="Currency selection">
      <div className='col-md-12'>
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
          <label className="btn btn-outline-success w-50" htmlFor={currency.toLowerCase()}>
            <Image
              src={`/${currency.toLowerCase()}.png`}
              alt={currency}
              width={24}
              height={24}
              style={{ marginRight: '4px' }}
            />
            {currency}
          </label>
        </React.Fragment>
      ))}
      </div>
      <div className="col-md-12 text-center mt-3">
        <strong>Wallet Balance: {balance.toFixed(2)} {selectedCurrency}</strong>
      </div>
    </div>
  );
};

export default CurrencySelector;
