import Web3 from "web3";  // Make sure to import web3

const web3 = new Web3();

const approveSpend = async (
  spenderAddress,
  amount, // Amount is already in the correct 18 or 6 decimals format
  contractAddress,
  contractABI
) => {
  try {
    const userAddress = tronWeb.defaultAddress.base58;
    const contract = await tronWeb.contract(contractABI, contractAddress);

    // Fetch the current allowance
    const currentAllowance = await contract
      .allowance(userAddress, spenderAddress)
      .call();

    console.log(`Current allowance: ${currentAllowance} and amount required: ${amount}`);

    // Convert allowance and amount to BigInt for comparison without any additional modification
    const currentAllowanceBigInt = BigInt(currentAllowance);
    const amountBigInt = BigInt(amount); // Amount already has the correct number of decimals (18 or 6)

    // If the current allowance is greater than or equal to the requested amount, skip approval
    if (currentAllowanceBigInt >= amountBigInt) {
      console.log("Sufficient allowance already granted. No need for further approval.");
      return { success: true, txID: null };
    }

    console.log("Approving more token for spending...");
    const result = await contract.approve(spenderAddress, amountBigInt.toString()).send({
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
