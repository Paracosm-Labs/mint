const verifyWallet = async () => {
  return await tronWeb.request({
    method: "tron_requestAccounts",
    // params: {
    //   websiteIcon: '<WEBSITE ICON URI>',
    //   websiteName: '<WEBSITE NAME>',
    // },
  });
};

const signUsingWallet = async (message) => {
  const tron = window.tron;
  const tronWeb = tron.tronWeb;
  const signature = await tronWeb.trx.signMessageV2(message);
  return signature;
};

const getAddress = async () => {
  if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
    return window.tronWeb.defaultAddress.base58;
  }
  return null;
};

const getMaskedAddress = (accountNumber, start = 3, end = 30) => {
  if (accountNumber) {
    return accountNumber.replace(accountNumber.substring(start, end), "****");
  }
  return "";
};

export { verifyWallet, signUsingWallet, getAddress, getMaskedAddress };
