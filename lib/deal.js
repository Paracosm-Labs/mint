import ClubDealRegistryABI from "../abi/ClubDealsRegistry.js";
import { clubDealRegistryAddress } from "../lib/address";

const createDeal = async (
  clubId,
  maxSupply,
  expiryDate,
  metadataURI,
  maxMintPerMember
) => {
  try {
    if (typeof window.tronWeb === "undefined") {
      throw new Error("TronLink is not installed or TronWeb is not available.");
    }

    const tronWeb = window.tronWeb;

    if (!tronWeb.defaultAddress.base58) {
      throw new Error("User is not logged in to TronLink.");
    }

    let contractAddress = clubDealRegistryAddress;
    let abi = ClubDealRegistryABI;

    const contract = await tronWeb.contract(abi, contractAddress);

    // Convert the date from "YYYY-MM-DD" format to Unix timestamp
    const expiryDateUnix = Math.floor(new Date(expiryDate).getTime() / 1000);

    // Create the transaction object
    const transaction = await contract
      .createDeal(
        clubId,
        maxSupply,
        expiryDateUnix,
        metadataURI,
        maxMintPerMember
      )
      .send({
        from: tronWeb.defaultAddress.base58, // This fetches the currently logged-in user's TronLink address
      });

    // Return the transaction ID
    return transaction;
  } catch (error) {
    console.error("Error creating deal:", error);
    throw error;
  }
};

const getDealIdFromEvent = async (txId) => {
  try {
    // Ensure TronLink is installed
    if (typeof window.tronWeb === "undefined") {
      throw new Error("TronLink is not installed or TronWeb is not available.");
    }

    const tronWeb = window.tronWeb;

    let contractAddress = clubDealRegistryAddress;

    let eventResult = await tronWeb.getEventResult(contractAddress, {
      eventName: "DealCreated",
      size: 100,
    });
    console.log(eventResult);
    let clubId = null;
    let dealId = null;
    if (eventResult.length > 0) {
      for (let index = 0; index < eventResult.length; index++) {
        const event = eventResult[index];
        const eventTrxn = event.transaction;
        if (eventTrxn == txId) {
          clubId = event.result.clubId;
          dealId = event.result.dealId;
          break;
        }
      }
    }
    return { clubId, dealId };
  } catch (error) {
    console.error("Error fetching clubId, dealId from event log:", error);
    throw error;
  }
};

const getDealDetails = async (clubId, dealId) => {
  try {
    // Ensure TronLink is installed and available
    if (!window.tronWeb || !window.tronWeb.defaultAddress.base58) {
      throw new Error("TronLink is not installed or the user is not logged in");
    }

    let contractAddress = clubDealRegistryAddress;

    // Get the contract instance
    const contract = await tronWeb.contract().at(contractAddress);

    // Call the clubDeals mapping to get deal details, except mintsPerMember
    const deal = await contract.clubDeals(clubId, dealId).call();

    // Extract deal details
    const dealDetails = {
      dealId: tronWeb.toDecimal(deal.dealId),
      maxSupply: tronWeb.toDecimal(deal.maxSupply),
      remainingSupply: tronWeb.toDecimal(deal.remainingSupply),
      redeemedSupply: tronWeb.toDecimal(deal.redeemedSupply),
      expiryDate: new Date(tronWeb.toDecimal(deal.expiryDate) * 1000), // Convert Unix timestamp to Date
      maxMintsPerMember: tronWeb.toDecimal(deal.maxMintsPerMember),
      metadataURI: deal.metadataURI,
    };

    console.log("Deal details:", dealDetails);
    return dealDetails; // Return the deal details
  } catch (error) {
    console.error("Error getting deal details:", error);
    return null; // Return null in case of an error
  }
};

/**
 * Loads the deals associated with a given club.
 *
 * @param {Object} club - The club object containing the club ID.
 * @returns {Promise<Array<Object>>} - An array of deal objects, each containing the deal ID, description, image URL, transaction ID, and on-chain deal ID.
 */
const loadDealsForClub = async (club) => {
  let deals = [];
  try {
    if (!club) return [];
    console.log("club", club);

    const response = await fetch(
      "/api/deal?" +
        new URLSearchParams({
          club: club._id,
        }).toString()
    );

    const deals_ = await response.json();

    for (let index = 0; index < deals_.length; index++) {
      const deal = deals_[index];
      let onChainIdPair = await getDealIdFromEvent(deal.txID);
      let dealDetails = await getDealDetails(
        onChainIdPair.clubId,
        onChainIdPair.dealId
      );
      let image = "/placeholder.jpg";
      if (deal.image) {
        image = deal.image;
      }
      deals.push({
        _id: deal._id,
        description: deal.description,
        image: image,
        txID: deal.txID,
        onChainId: onChainIdPair.dealId,
        onChainClubId: onChainIdPair.clubId,
        ...dealDetails,
      });
    }
    console.log(deals);
  } catch (error) {
    console.error(error);
  }
  return deals;
};

export { createDeal, getDealIdFromEvent, getDealDetails, loadDealsForClub };
