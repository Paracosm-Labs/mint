// src/contracts/smartContractBase.js

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

  processEventsForUser = (events, maxEvents, userArgLabel, amountArgLabel) => {
    return events.slice(0, maxEvents).map((event) => {
      console.log("addressBaase58",window.tronWeb.address.fromHex(event.result[userArgLabel]));
      if (window.tronWeb.address.fromHex(event.result[userArgLabel]) === window.tronWeb.defaultAddress.base58) {
        return {
          user: event.result[userArgLabel],
          amount: this.web3.utils.fromWei(event.result[amountArgLabel], "ether"),
          txDate: new Date(event.timestamp).toISOString(),
          txId: event.transaction,
        };
      }
    });
  };

  getEventsForUser = async (maxEvents = 5, eventName, userArgLabel, amountArgLabel = "amount") => {
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
        userArgLabel, amountArgLabel
      );

      return formattedEvents.filter(event => event);
    } catch (error) {
      console.error(`Error fetching ${eventName} events:`, error);
      throw error;
    }
  };
}

export default SmartContractBase;
