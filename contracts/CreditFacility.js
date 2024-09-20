// src/contracts/CreditFacility.js
import SmartContractBase from "./smartContractBase";
import { CreditFacilityAddress } from "../lib/address";

class CreditFacility extends SmartContractBase {
  constructor() {
    super(CreditFacilityAddress);
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

  supplyAsset = async (cTokenAddress, amount, beneficiary) => {
    this.check();
    try {
      const result = await this.contract
        .supplyAsset(cTokenAddress, amount, beneficiary)
        .send();
      return result;
    } catch (error) {
      console.error("Error supplying asset:", error);
      throw error;
    }
  };

  redeemAsset = async (cTokenAddress, amount) => {
    this.check();
    try {
      const result = await this.contract
        .redeemAsset(cTokenAddress, amount)
        .send();
      return result;
    } catch (error) {
      console.error("Error redeeming asset:", error);
      throw error;
    }
  };

  borrow = async (cTokenAddress, amount) => {
    this.check();
    try {
      const amountInWei = this.web3.utils.toWei(amount.toString(), "ether");
      const result = await this.contract
        .borrow(cTokenAddress, amountInWei)
        .send();
      return result;
    } catch (error) {
      console.error("Error borrowing asset:", error);
      throw error;
    }
  };

  repay = async (cTokenAddress, amount, beneficiary) => {
    this.check();
    try {
      const amountInWei = this.web3.utils.toWei(amount.toString(), "ether");
      const result = await this.contract
        .repayBorrow(cTokenAddress, amountInWei, beneficiary)
        .send();
      return result;
    } catch (error) {
      console.error("Error repaying borrow:", error);
      throw error;
    }
  };

  accrueInterest = async (cTokenAddress, user) => {
    this.check();
    try {
      const result = await this.contract
        .accrueInterest(cTokenAddress, user)
        .send();
      return result;
    } catch (error) {
      console.error("Error accruing interest:", error);
      throw error;
    }
  };

  calculateTotalBorrowingPower = async (user) => {
    this.check();
    try {
      const result = await this.contract
        .calculateTotalBorrowingPower(user)
        .call();
      const formattedResult = this.web3.utils.fromWei(result, "ether");
      return parseFloat(formattedResult).toFixed(2);
    } catch (error) {
      console.error("Error calculating total borrowing power:", error);
      throw error;
    }
  };

  calculateTotalUserStablecoinBorrows = async (user) => {
    this.check();
    try {
      const result = await this.contract
        .calculateTotalUserStablecoinBorrows(user)
        .call();
      const formattedResult = this.web3.utils.fromWei(result, "ether");
      return parseFloat(formattedResult).toFixed(2);
    } catch (error) {
      console.error("Error calculating total user stablecoin borrows:", error);
      throw error;
    }
  };

  calculateTotalUserDeposits = async (user) => {
    this.check();
    try {
      const result = await this.contract
        .calculateTotalUserDeposits(user)
        .call();
      return {
        totalStablecoinDeposits: this.web3.utils.fromWei(result[0], "ether"),
        totalNonStablecoinDeposits: result[1],
      };
    } catch (error) {
      console.error("Error calculating total user deposits:", error);
      throw error;
    }
  };

  getUserReserveValuation = async (cTokenAddress, user) => {
    this.check();
    try {
      const result = await this.contract
        .getUserReserveValuation(cTokenAddress, user)
        .call();
      return result;
    } catch (error) {
      console.error("Error getting user reserve valuation:", error);
      throw error;
    }
  };

  getCTokenAddress = async (underlying) => {
    this.check();
    try {
      const result = await this.contract.getCTokenAddress(underlying).call();
      return result;
    } catch (error) {
      console.error("Error getting cToken address:", error);
      throw error;
    }
  };

  getBorrowedEvents = async (maxEvents) => {
    return this.getEventsForUser(maxEvents, "Borrowed", "borrower");
  };

  // Function to get loan repayment events
  getRepaymentEvents = async (maxEvents) => {
    return this.getEventsForUser(
      maxEvents,
      "LoanRepayment",
      "borrower",
      "repaymentAmount"
    );
  };
}

const creditFacility_ = new CreditFacility();
let creditFacilityInitialized = null;

export const creditFacility = async () => {
  if (!creditFacilityInitialized) {
    console.log("Initializing Credit Facility contract");
    creditFacilityInitialized = await creditFacility_.init();
  }
  return creditFacilityInitialized;
};
