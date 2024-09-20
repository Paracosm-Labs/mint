// src/contracts/CreditManager.js
import SmartContractBase from "./smartContractBase";
import { CreditManagerAddress } from "../lib/address";

class CreditManager extends SmartContractBase {
  constructor() {
    super(CreditManagerAddress);
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

  getCreditInfo = async (userAddress) => {
    this.check();

    try {
      // Fetch credit data from contract
      const result = await this.contract.getCreditInfo(userAddress).call();

      // Convert values to human-readable format
      const score = result[0].toNumber();
      const creditBalanceUsed = parseFloat(
        this.web3.utils.fromWei(result[1], "ether")
      ).toFixed(2);
      const borrowingCapacity = parseFloat(
        this.web3.utils.fromWei(result[2], "ether")
      ).toFixed(2);

      return {
        score: score,
        limit: borrowingCapacity,
        used: creditBalanceUsed,
      };
    } catch (error) {
      console.error("Error fetching credit info:", error);
      return {
        score: 0,
        limit: 0,
        used: 0,
      };
    }
  };

  // Function to borrow tokens from the credit manager
  borrow = async (tokenAddress, amount) => {
    this.check();

    try {
      const amountInWei = this.web3.utils.toWei(amount.toString(), "ether");
      const result = await this.contract
        .borrow(tokenAddress, amountInWei)
        .send();
      return result;
    } catch (error) {
      console.error("Error borrowing tokens:", error);
      throw error;
    }
  };

  // Function to repay tokens to the credit manager
  repay = async (tokenAddress, repaymentAmount) => {
    this.check();

    try {
      const amountInWei = this.web3.utils.toWei(
        repaymentAmount.toString(),
        "ether"
      );
      const result = await this.contract
        .repay(tokenAddress, amountInWei)
        .send();
      return result;
    } catch (error) {
      console.error("Error repaying tokens:", error);
      throw error;
    }
  };

  // Function to fetch interestDeltaBP
  getInterestDeltaPB = async () => {
    this.check();

    try {
      const result = await this.contract.interestDeltaPB().call();
      return result;
    } catch (error) {
      console.error("Error fetching interestDeltaPB:", error);
      throw error;
    }
  };

  // Function to get global max credit limit
  getGlobalMaxCreditLimit = async () => {
    this.check();

    try {
      const result = await this.contract.globalMaxCreditLimit().call();
      return result;
    } catch (error) {
      console.error("Error getting global max credit limit:", error);
      throw error;
    }
  };

  // Function to get total credit used by all users
  getTotalCreditUsed = async () => {
    this.check();

    try {
      const result = await this.contract.totalCreditUsed().call();
      return result;
    } catch (error) {
      console.error("Error getting total credit used:", error);
      throw error;
    }
  };

  // Function to supply tokens to the credit manager (open but used by Admin)
  supply = async (tokenAddress, amount) => {
    this.check();

    try {
      const result = await this.contract.supply(tokenAddress, amount).send();
      return result;
    } catch (error) {
      console.error("Error supplying tokens:", error);
      throw error;
    }
  };

  // Function to withdraw tokens from the credit manager (only Admin)
  withdraw = async (tokenAddress, amount) => {
    this.check();

    try {
      const result = await this.contract.withdraw(tokenAddress, amount).send();
      return result;
    } catch (error) {
      console.error("Error withdrawing tokens:", error);
      throw error;
    }
  };

  // Function to update Global Max Credit Limit (only Admin)
  updateGlobalMaxCreditLimit = async (cTokenAddress) => {
    this.check();

    try {
      const result = await this.contract
        .updateGlobalMaxCreditLimit(cTokenAddress)
        .send();
      return result;
    } catch (error) {
      console.error("Error updating global limit:", error);
      throw error;
    }
  };

  getBorrowedEvents = async (maxEvents) => {
    return this.getEventsForUser(maxEvents, "Borrowed", "user");
  };

  // Function to get loan repayment events
  getLoanRepaymentEvents = async (maxEvents) => {
    return this.getEventsForUser(maxEvents, "LoanRepayment", "user");
  };
}

const creditManager_ = new CreditManager();
let creditManagerInitialized = null;

export const creditManager = async () => {
  if (!creditManagerInitialized) {
    console.log("Initializing Credit Manager contract");
    creditManagerInitialized = await creditManager_.init();
  }
  return creditManagerInitialized;
};
