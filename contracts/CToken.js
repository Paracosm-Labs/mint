// src/contracts/cToken.js
import SmartContractBase from "./smartContractBase";
import { USDDcTokenAddress } from "../lib/address";

class CToken extends SmartContractBase {
  constructor() {
    super(USDDcTokenAddress);
  }

  init = async () => {
    try {
      if (!this.contract) {
        // Initialize contract using window.tronWeb
        this.contract = await window.tronWeb.contract().at(this.address);
      }
      return this;
    } catch (error) {
      console.error("Error initializing contract:", error);
      return null;
    }
  };

  // Function to get borrow rate per block from the cToken
  getBorrowRatePerBlock = async () => {
    this.check();

    try {
      const result = await this.contract.borrowRatePerBlock().call();
      return result;
    } catch (error) {
      console.error("Error fetching borrow rate per block:", error);
      throw error;
    }
  };
}

const cToken_ = new CToken();
let cTokenInitialized = null;

export const cToken = async () => {
  if (!cTokenInitialized) {
    console.log("Initializing JustLend's cToken contract");
    cTokenInitialized = await cToken_.init();
  }
  return cTokenInitialized;
};
