// src/contracts/CreditFacility.js
import SmartContractBase from "./smartContractBase";
import { CreditFacilityAddress } from "../lib/address";
import approveSpend from "../lib/approveSpend";
import trc20 from "../abi/trc20";
import Web3 from "web3";

class CreditFacility extends SmartContractBase {
  constructor() {
    super(CreditFacilityAddress);
    this.web3 = new Web3();
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

  borrow = async (cTokenAddress, amount, tokenDecimals) => {
    this.check();
    try {

      // Get the user's total borrowing power
      const borrowingCapacity = await this.calculateTotalBorrowingPower(window.tronWeb.defaultAddress.base58);
      
      // Get the user's total stablecoin borrows
      const totalUserBorrows = await this.calculateTotalUserStablecoinBorrows(window.tronWeb.defaultAddress.base58);
      
      // Calculate the available borrowing capacity
      const availableBorrowingCapacity = parseFloat(borrowingCapacity) - parseFloat(totalUserBorrows);

      // Normalize amount based on token decimals
      let normalizedAmount;
      if (tokenDecimals === 6) {
        normalizedAmount = Math.floor(parseFloat(amount) * 1e6).toString(); // For 6-decimal tokens
      
      } else {
        normalizedAmount = this.web3.utils.toWei(amount.toString(), "ether"); // For 18-decimal tokens
      
      }

      // alert(`${amount} and ${availableBorrowingCapacity}`)
      // Ensure the user has enough capacity to borrow the requested amount
      if (amount > availableBorrowingCapacity) {
        throw new Error(`Insufficient borrowing capacity.`);
      }

      const result = await this.contract
        .borrow(cTokenAddress, normalizedAmount)
        .send();
      return result;
    } catch (error) {
      console.error("Error borrowing asset:", error);
      throw error;
    }
  };

  repay = async (tokenAddress, amount, beneficiary, tokenDecimals) => {
    this.check();
    try {
      // Get the user's total stablecoin borrows
      const totalUserBorrows = await this.calculateTotalUserStablecoinBorrows(window.tronWeb.defaultAddress.base58);
  
      // Normalize amount based on token decimals
      let normalizedAmount;
      if (tokenDecimals === 6) {
        normalizedAmount = Math.floor(parseFloat(amount) * 1e6).toString(); // For 6-decimal tokens
      } else {
        normalizedAmount = this.web3.utils.toWei(amount.toString(), "ether"); // For 18-decimal tokens
      }
  
      // Ensure the user is repaying within the total borrowed amount
      if (amount > totalUserBorrows) {
        throw new Error(`Repayment amount exceeds total borrowed balance.`);
      }
  
      const cTokenAddress = await this.getCTokenAddress(tokenAddress);
  
      // Approve the spend for the repayment amount
      await approveSpend(
        CreditFacilityAddress,  // The contract address for the token
        normalizedAmount,       // The normalized amount for approval
        tokenAddress,           // Token address to approve
        trc20                   // ABI for token interaction (TRC20)
      );
  
      // Proceed with repayment transaction
      const result = await this.contract
        .repayBorrow(cTokenAddress, normalizedAmount, beneficiary)
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
    return this.getEventsForUser(maxEvents, "Borrowed", "borrower", "cTokenAddress");
  };

  // Function to get loan repayment events
  getRepaymentEvents = async (maxEvents) => {
    return this.getEventsForUser(
      maxEvents,
      "LoanRepayment",
      "borrower",
      "amount"
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
