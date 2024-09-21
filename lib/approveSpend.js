import Web3 from "web3";  // Make sure to import web3

const web3 = new Web3();

const approveSpend = async (
  spenderAddress,
  amount, // Amount in 18 or 6 decimals
  contractAddress,
  contractABI,
) => {
  try {
    const userAddress = tronWeb.defaultAddress.base58;
    const contract = await tronWeb.contract(contractABI, contractAddress);


    const currentAllowance = await contract
      .allowance(userAddress, spenderAddress)
      .call();

    console.log(`Current allowance: ${currentAllowance}`);
    
    if (currentAllowance >= amount) {
      console.log("Sufficient allowance already granted. No need for further approval.");
      return { success: true, txID: null };
    }

    console.log("Approving more token for spending...");
    const result = await contract.approve(spenderAddress, amount).send({
      feeLimit: 1000000000,
      callValue: 0,
    });

    const txID = result;
    console.log("Approved. Transaction ID:", txID);
    let txn = await tronWeb.trx.getTransaction(txID);
    console.log("Approval txn", txn);
    if (txn && txn.ret && txn.ret[0] && txn.ret[0].contractRet === "SUCCESS") {
      console.log("Approval transaction was successful.");
      return { success: true, txID: txID };
    } else {
      console.error("Transaction failed or not confirmed yet");
      throw new Error("Approval transaction failed");
    }
  } catch (error) {
    console.error("Error :", error);
    throw error;
  }
};

export default approveSpend;
