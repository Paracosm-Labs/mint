// src/contracts/smartContractBase.js
import { USDTcTokenAddress } from "@/lib/address";
import Web3 from "web3";

class SmartContractBase {
  address;
  contract = null;
  web3 = null;
  constructor(_address) {
    this.address = _address;
    this.web3 = new Web3();
  }

  check = () => {
    if (!this.contract)
      throw new Error(`contract at ${this.address} not initialized`);
  };

  processEventsForUser = (events, maxEvents, userArgLabel, tokenArgLabel, amountArgLabel) => {
    return events.slice(0, maxEvents).map((event) => {
      // Convert user address from hex to base58
      const userAddressBase58 = window.tronWeb.address.fromHex(event.result[userArgLabel]);
  
      // Check if the user address matches the default address
      if (userAddressBase58 === window.tronWeb.defaultAddress.base58) {
        // Extract cToken and check if it's the USDT cToken
        const cToken = window.tronWeb.address.fromHex(event.result[tokenArgLabel]);
  
        // Determine the correct amount (normalize if USDT cToken)
        const amount = cToken === USDTcTokenAddress
          ? this.web3.utils.fromWei((event.result[amountArgLabel] * 10**12).toString(), "ether")  // Normalize USDT (6 decimals to 18)
          : this.web3.utils.fromWei(event.result[amountArgLabel], "ether");  // Leave as is for USDD (already 18 decimals)
  
        // Return the formatted transaction data
        return {
          user: userAddressBase58,
          amount: amount,
          txDate: new Date(event.timestamp).toISOString(),
          txId: event.transaction,
        };
      }
    })
  };
  

  getEventsForUser = async (maxEvents = 5, eventName, userArgLabel, tokenArgLabel, amountArgLabel = "amount") => {
    this.check();
    try {
      const events = await window.tronWeb.getEventResult(this.address, {
        eventName: eventName,
        size: maxEvents, // Max number of events to fetch
      });

      // Process events
      const formattedEvents = this.processEventsForUser(
        events,
        maxEvents,
        userArgLabel, tokenArgLabel, amountArgLabel
      );

      return formattedEvents.filter(event => event);
    } catch (error) {
      console.error(`Error fetching ${eventName} events:`, error);
      throw error;
    }
  };
}

export default SmartContractBase;
