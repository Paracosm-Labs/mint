// src/contracts/ClubDealRegistry.js
import SmartContractBase from './smartContractBase';
import { clubDealRegistryAddress } from '../lib/address';

class ClubDealRegistry extends SmartContractBase {
  constructor() {
    super(clubDealRegistryAddress);
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

  createClub = async (paymentTokenAddress, membershipFee, sendToCreditFacility) => {
    this.check();
    try {
      const result = await this.contract.createClub(paymentTokenAddress, membershipFee, sendToCreditFacility).send();
      return result;
    } catch (error) {
      console.error("Error creating club:", error);
      throw error;
    }
  };

  addClubMember = async (clubId, newMember, paymentTokenAddress) => {
    this.check();
    try {
      const result = await this.contract.addClubMember(clubId, newMember, paymentTokenAddress).send();
      return result;
    } catch (error) {
      console.error("Error adding club member:", error);
      throw error;
    }
  };

  updateClub = async (clubId, membershipFee, active, sendToCreditFacility) => {
    this.check();
    try {
      const result = await this.contract.updateClub(clubId, membershipFee, active, sendToCreditFacility).send();
      return result;
    } catch (error) {
      console.error("Error updating club:", error);
      throw error;
    }
  };

  isMember = async (clubId, address) => {
    this.check();
    try {
      const result = await this.contract.isMember(clubId, address).call();
      return result;
    } catch (error) {
      console.error("Error checking if member:", error);
      throw error;
    }
  };

  getClubCount = async () => {
    this.check();
    try {
      const result = await this.contract.getClubCount().call();
      return result;
    } catch (error) {
      console.error("Error getting club count:", error);
      throw error;
    }
  };

  getClubMemberCount = async (clubId) => {
    this.check();
    try {
      const result = await this.contract.getClubMemberCount(clubId).call();
      return result;
    } catch (error) {
      console.error("Error getting club member count:", error);
      throw error;
    }
  };

  createDeal = async (clubId, maxSupply, expiryDate, metadataURI, maxMintPerMember) => {
    this.check();
    try {
      const result = await this.contract.createDeal(clubId, maxSupply, expiryDate, metadataURI, maxMintPerMember).send();
      return result;
    } catch (error) {
      console.error("Error creating deal:", error);
      throw error;
    }
  };

  mintDeal = async (clubId, dealId) => {
    this.check();
    try {
      const result = await this.contract.mintDeal(clubId, dealId).send();
      return result;
    } catch (error) {
      console.error("Error minting deal:", error);
      throw error;
    }
  };

  confirmRedemption = async (clubId, dealId, tokenId) => {
    this.check();
    try {
      const result = await this.contract.confirmRedemption(clubId, dealId, tokenId).send();
      return result;
    } catch (error) {
      console.error("Error confirming redemption:", error);
      throw error;
    }
  };

  getDealDetails = async (clubId, dealId) => {
    this.check();
    try {
      const result = await this.contract.getDealDetails(clubId, dealId).call();
      return result;
    } catch (error) {
      console.error("Error getting deal details:", error);
      throw error;
    }
  };

  getClubsForMember = async (userAddress) => {
    this.check();
    try {
      const result = await this.contract.getClubsForMember(userAddress).call();
      return result;
    } catch (error) {
      console.error("Error getting clubs for member:", error);
      throw error;
    }
  };

  getCreatedClubs = async (maxEvents) => {
    this.check();
    try {
      const events = await this.web3.getEventResult(clubDealRegistryAddress, {
        eventName: 'ClubCreated',
        size: maxEvents,
      });
      
      return events.map(event => ({
        clubId: event.result.clubId,
        owner: event.result.owner,
        membershipFee: event.result.membershipFee,
      }));
    } catch (error) {
      console.error('Error fetching created clubs:', error);
      throw error;
    }
  };

  getClubMembersByClubId = async (clubIdToFilter, maxEvents) => {
    this.check();
    try {
      const events = await this.web3.getEventResult(clubDealRegistryAddress, {
        eventName: 'MemberAdded',
        size: maxEvents,
      });

      return events
        .filter(event => event.result.clubId === clubIdToFilter)
        .map(event => ({
          member: event.result.member,
          membershipFee: event.result.membershipFee,
        }));
    } catch (error) {
      console.error('Error fetching members:', error);
      throw error;
    }
  };
}

const clubDealRegistry_ = new ClubDealRegistry();
let clubDealRegistryInitialized = null;

export const clubDealRegistry = async () => {
  if (!clubDealRegistryInitialized) {
    console.log("Initializing Club Deal Registry contract");
    clubDealRegistryInitialized = await clubDealRegistry_.init();
  }
  return clubDealRegistryInitialized;
};
