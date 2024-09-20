import trc20 from "../abi/trc20";
import ClubDealRegistryABI from "../abi/ClubDealsRegistry.js";
import { clubDealRegistryAddress } from "../lib/address";
import approveSpend from "../lib/approveSpend";
import Web3 from "web3";

const getClubCreationFee = async (abi, contractAddress) => {
  const contract = await tronWeb.contract(abi, contractAddress);
  const result = await contract.clubCreationFee().call();
  return result;
};

const createClubOnChain = async (
  paymentTokenAddress,
  membershipFee,
  sendToCreditFacility
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

    let clubCreationFee = await getClubCreationFee(abi, contractAddress);

    console.log("clubCreationFee : ", clubCreationFee);

    await approveSpend(
      contractAddress,
      clubCreationFee,
      paymentTokenAddress,
      trc20
    );

    const contract = await tronWeb.contract(abi, contractAddress);

    const result = await contract
      .createClub(paymentTokenAddress, membershipFee, sendToCreditFacility)
      .send({
        feeLimit: 1000000000,
        callValue: 0,
      });

    const txID = result;
    console.log("createClub Transaction ID:", txID);
    let txn = await tronWeb.trx.getTransaction(txID);

    if (txn && txn.ret && txn.ret[0] && txn.ret[0].contractRet === "SUCCESS") {
      console.log("createClub transaction was successful.");
      return txID;
    } else {
      console.error("Transaction failed or not confirmed yet");
      throw new Error("CreateClub transaction failed");
    }
  } catch (error) {
    console.error("Error in createClub function:", error);
    throw error;
  }
};

const getClubIdFromEvent = async (txId) => {
  try {
    // Ensure TronLink is installed
    if (typeof window.tronWeb === "undefined") {
      throw new Error("TronLink is not installed or TronWeb is not available.");
    }

    const tronWeb = window.tronWeb;

    if (!tronWeb.defaultAddress.base58) {
      throw new Error("User is not logged in to TronLink.");
    }

    let contractAddress = clubDealRegistryAddress;

    let eventResult = await tronWeb.getEventResult(contractAddress, {
      eventName: "ClubCreated",
      size: 100,
    });
    console.log(eventResult);
    let clubId = null;
    if (eventResult.length > 0) {
      for (let index = 0; index < eventResult.length; index++) {
        const event = eventResult[index];
        const eventTrxn = event.transaction;
        if (eventTrxn == txId) {
          clubId = event.result.clubId;
          break;
        }
      }
    }
    return clubId;
  } catch (error) {
    console.error("Error fetching clubId from event log:", error);
    throw error;
  }
};

const getEventTxIDFromClubId = async (clubId) => {
  try {
    // Ensure TronLink is installed
    if (typeof window.tronWeb === "undefined") {
      throw new Error("TronLink is not installed or TronWeb is not available.");
    }

    const tronWeb = window.tronWeb;

    let contractAddress = clubDealRegistryAddress;

    let eventResult = await tronWeb.getEventResult(contractAddress, {
      eventName: "ClubCreated",
      size: 100,
    });
    // console.log(eventResult);
    let txID = null;
    if (eventResult.length > 0) {
      for (let index = 0; index < eventResult.length; index++) {
        const event = eventResult[index];
        if (event.result.clubId == clubId) {
          txID = event.transaction;
          break;
        }
      }
    }
    return txID;
  } catch (error) {
    console.error("Error fetching txID from event log:", error);
    throw error;
  }
};

// Function to get club details using the public getter generated for `clubs` mapping
const getClubDetails = async (clubId) => {
  try {
    // Ensure TronLink is installed and the user is logged in
    if (typeof window.tronWeb === "undefined") {
      throw new Error("TronLink not found. Please install TronLink.");
    }

    const tronWeb = window.tronWeb;

    let contractAddress = clubDealRegistryAddress;
    let abi = ClubDealRegistryABI;

    // Get the contract instance
    const contract = await tronWeb.contract(abi, contractAddress);

    const club = await contract.clubs(clubId).call();

    // club will return an object with public struct fields (except mappings)
    const membershipFee = tronWeb.toDecimal(club.membershipFee);
    const memberCount = tronWeb.toDecimal(club.memberCount);

    console.log(
      `Membership Fee: ${membershipFee}, Member Count: ${memberCount}`
    );

    // Return the relevant details
    return {
      membershipFee,
      memberCount,
    };
  } catch (error) {
    console.error("Error fetching club details:", error);
    throw error;
  }
};
const addClubMember = async (clubId, paymentTokenAddress, membershipFee) => {
  try {
    // Ensure TronLink is installed and the user is logged in
    if (typeof window.tronWeb === "undefined") {
      throw new Error(
        "TronLink not found. Please install TronLink and log in."
      );
    }

    const tronWeb = window.tronWeb;

    if (!tronWeb.defaultAddress.base58) {
      throw new Error("User is not logged in to TronLink.");
    }

    let contractAddress = clubDealRegistryAddress;
    let abi = ClubDealRegistryABI;

    let web3 = new Web3();

    let membershipFee_ = web3.utils.toWei(String(membershipFee), "ether");

    await approveSpend(
      contractAddress,
      membershipFee_,
      paymentTokenAddress,
      trc20
    );

    // Get the contract instance
    const contract = await tronWeb.contract(abi, contractAddress);

    // Estimate the transaction amount (if needed) and set up the transaction
    const tx = await contract
      .addClubMember(clubId, tronWeb.defaultAddress.base58, paymentTokenAddress)
      .send({
        feeLimit: 1000000000, // Set the fee limit for the transaction (in Sun)
      });

    console.log(`Transaction successful with ID: ${tx}`);

    return tx; // Return transaction ID to check for success
  } catch (error) {
    console.error("Error while adding club member:", error);
    throw error; // Re-throw the error to handle it in the UI or logs
  }
};

const getClubsForMember = async () => {
  try {
    // Ensure TronLink is installed and the user is logged in
    if (typeof window.tronWeb === "undefined") {
      throw new Error(
        "TronLink not found. Please install TronLink and log in."
      );
    }

    const tronWeb = window.tronWeb;

    if (!tronWeb.defaultAddress.base58) {
      throw new Error("User is not logged in to TronLink.");
    }

    let userAddress = tronWeb.defaultAddress.base58; // Replace with the user's Tron address

    let contractAddress = clubDealRegistryAddress;
    let abi = ClubDealRegistryABI;

    // Get the contract instance
    const contract = await tronWeb.contract(abi, contractAddress);

    // Call the `getClubsForMember` function from the contract
    const clubs_ = await contract.getClubsForMember(userAddress).call();

    const clubs = clubs_.map((clubId) => clubId.toNumber());

    console.log("Clubs for member:", clubs);

    return clubs; // This will be an array of club IDs
  } catch (error) {
    console.error("Error fetching clubs for the member:", error);
    throw error;
  }
};

const isUserClubMember = async (clubId) => {
  try {
    // Fetch the club members array for the given clubId
    const clubs = await getClubsForMember();

    // Check if the userAddress is in the clubMembers array
    const isMember = clubs.includes(parseInt(clubId));

    return isMember;
  } catch (error) {
    console.error("Error while checking club membership:", error);
    throw error; // Re-throw the error to handle it in the UI or logs
  }
};
const mintDeal = async (clubId, dealId) => {
  try {
    // Ensure TronLink is installed and the user is logged in
    if (typeof window.tronWeb === "undefined") {
      throw new Error(
        "TronLink not found. Please install TronLink and log in."
      );
    }

    const tronWeb = window.tronWeb;

    if (!tronWeb.defaultAddress.base58) {
      throw new Error("User is not logged in to TronLink.");
    }

    let contractAddress = clubDealRegistryAddress;
    let abi = ClubDealRegistryABI;

    let web3 = new Web3();

    // Get the contract instance
    const contract = await tronWeb.contract(abi, contractAddress);

    // Estimate the transaction amount (if needed) and set up the transaction
    const tx = await contract.mintDeal(clubId, dealId).send({
      feeLimit: 1000000000, // Set the fee limit for the transaction (in Sun)
    });

    console.log(`Transaction successful with ID: ${tx}`);

    return tx; // Return transaction ID to check for success
  } catch (error) {
    console.error("Error while adding club member:", error);
    throw error; // Re-throw the error to handle it in the UI or logs
  }
};

export {
  approveSpend,
  createClubOnChain,
  getClubIdFromEvent,
  getEventTxIDFromClubId,
  getClubDetails,
  addClubMember,
  isUserClubMember,
  getClubsForMember,
  mintDeal,
};
