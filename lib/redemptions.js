/*
1. Get the Club Id

2. Get the Deal Ids from ClubDealRegistry
event DealCreated(uint256 indexed clubId, uint256 indexed dealId, uint256 maxSupply, uint256 expiryDate, string metadataURI); 

3. Get the Token Id from MintDealsNFT for each Deal Id
event NFTMinted(address recipient, uint256 tokenId, uint256 dealId, string metadataURI);

4. Get the Redemption Request from MintDealsNFT  for each tokenId
mapping(uint256 => bool) public redemptionRequests; // or
event RedeemRequest(address holder, uint256 tokenId);

5. Get all the Confirmed Deal Redemptions for the Club Id and the Deal Ids from ClubDealRegistry 
event DealRedemptionConfirmed(uint256 indexed clubId, uint256 indexed dealId, address indexed member);
or MintDealsNFT
event NFTRedeemed(uint256 tokenId, uint256 dealId);

6. For each Redemption Request in step 4 check if confirmed or not.


My smart contract throws an event 
event NFTRedeemed(uint256 tokenId, uint256 dealId);
Write a javascript function that will take the tokenId and will check if the event was thrown 
const isRedemptionConfirmed = async (tokenId) => {}
This function will be called on the browser where Tronlink will be installed.


*/
import { mintDealsNFTAddress, clubDealRegistryAddress } from "./address";
import { loadDealsForClub } from "./deal";
import { getMaskedAddress } from "./wallet";

const getNFTTokenIdsForDeal = async (dealId) => {
  try {
    // Ensure TronLink is available and ready
    if (!window.tronWeb || !window.tronWeb.ready) {
      throw new Error("TronLink is not available or not logged in");
    }

    let contractAddress = mintDealsNFTAddress;

    // Fetch the events emitted by the smart contract
    const events = await window.tronWeb.getEventResult(contractAddress, {
      eventName: "NFTMinted",
      size: 100,
    });

    // Filter events by the provided dealId and return the associated tokenId
    const matchingEvents = events.filter(
      (event) => event.result.dealId === dealId.toString()
    );

    // If no matching events are found, return an empty array or handle it accordingly
    if (matchingEvents.length === 0) {
      console.log(`No NFTs minted for dealId: ${dealId}`);
      return [];
    }

    // Extract and return the tokenId(s) for the dealId
    const tokenIds = matchingEvents.map((event) => ({
      tokenId: event.result.tokenId,
      owner: getMaskedAddress(tronWeb.address.fromHex(event.result.recipient)),
    }));

    return tokenIds;
  } catch (error) {
    console.error("Error fetching NFT tokenIds for deal:", error);
    throw error;
  }
};

// const isRedemptionRequested = async (tokenId) => {
//   try {
//     // Ensure TronLink is available and ready
//     if (!window.tronWeb || !window.tronWeb.ready) {
//       throw new Error("TronLink is not available or not logged in");
//     }

//     let contractAddress = mintDealsNFTAddress;

//     // Fetch the events emitted by the smart contract
//     const events = await window.tronWeb.getEventResult(contractAddress, {
//       eventName: "RedeemRequest",
//       size: 100000,
//     });

//     // Filter events to find the one that matches the provided tokenId
//     const matchingEvents = events.filter(
//       (event) => event.result.tokenId === tokenId.toString()
//     );

//     // Return true if a matching event is found, otherwise false
//     return matchingEvents.length > 0;
//   } catch (error) {
//     console.error("Error checking redemption request status:", error);
//     throw error;
//   }
// };

const isRedemptionRequested = async (tokenId) => {
  try {
    // Ensure TronLink is available and ready
    if (!window.tronWeb || !window.tronWeb.ready) {
      throw new Error("TronLink is not available or not logged in");
    }

    let contractAddress = mintDealsNFTAddress;

    // Get the contract instance (ensure TronWeb is initialized via TronLink)
    const contract = await tronWeb.contract().at(contractAddress);

    // Call the redemptionRequests mapping from the smart contract
    const redemptionStatus = await contract.redemptionRequests(tokenId).call();

    // Return the status (true if redemption is requested, false otherwise)
    return redemptionStatus;
  } catch (error) {
    console.error("Error checking redemption request status: ", error);
    return false; // Return false if there is an error or the tokenId is invalid
  }
};

const isRedemptionConfirmed = async (tokenId) => {
  try {
    // Ensure TronLink is available and ready
    if (!window.tronWeb || !window.tronWeb.ready) {
      throw new Error("TronLink is not available or not logged in");
    }

    let contractAddress = mintDealsNFTAddress;

    // Fetch the events emitted by the smart contract
    const events = await window.tronWeb.getEventResult(contractAddress, {
      eventName: "NFTRedeemed",
      size: 100, // Retrieve the last 100 events (adjust as needed)
    });

    // Filter events to find the one that matches the provided tokenId
    const matchingEvents = events.filter(
      (event) => event.result.tokenId === tokenId.toString()
    );

    // Return true if a matching event is found, otherwise false
    return matchingEvents.length > 0;
  } catch (error) {
    console.error("Error checking redemption confirmation:", error);
    throw error;
  }
};

const getRedemptionRequests = async (club) => {
  try {
    let redemptionRequests = [];

    let deals = await loadDealsForClub(club);

    for (let index = 0; index < deals.length; index++) {
      const deal = deals[index];

      let tokenDataList = await getNFTTokenIdsForDeal(deal.onChainId);

      for (let index = 0; index < tokenDataList.length; index++) {
        const tokenId = tokenDataList[index].tokenId;

        let isRequested = await isRedemptionRequested(tokenId);

        if (isRequested) {
          let isConfirmed = await isRedemptionConfirmed(tokenId);
          let redemptionRequest = {
            ...deal,
            ...tokenDataList[index],
            status: isConfirmed ? "Confirmed" : "Pending",
            id: tokenId,
          };
          console.log(redemptionRequest);

          redemptionRequests.push(redemptionRequest);
        }
      }
    }
    return redemptionRequests;
  } catch (error) {
    console.error(error);
  }
};

const confirmRedemption = async (_clubId, _dealId, tokenId) => {
  try {
    // Ensure TronLink is installed and available
    if (!window.tronWeb || !window.tronWeb.defaultAddress.base58) {
      throw new Error("TronLink is not installed or the user is not logged in");
    }

    let contractAddress = clubDealRegistryAddress;

    // Get the contract instance
    const contract = await tronWeb.contract().at(contractAddress);

    // Call the confirmRedemption function on the smart contract
    const transaction = await contract
      .confirmRedemption(_clubId, _dealId, tokenId)
      .send({
        feeLimit: 100_000_000, // Optional: Set fee limit, can be adjusted
        shouldPollResponse: true, // Wait for the transaction to be confirmed
      });

    console.log("Transaction successful with ID:", transaction);
    return transaction; // Returns the transaction ID
  } catch (error) {
    console.error("Error calling confirmRedemption:", error);
    throw error;
  }
};

export { getRedemptionRequests, confirmRedemption, isRedemptionRequested };
