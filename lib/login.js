import { getAddress, signUsingWallet, verifyWallet } from "./wallet";
import { toast } from "react-toastify";

const verifySignature = async (signature, address) => {
  const response = await fetch("/api/auth/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sign: signature, address: address }),
  });
  if (response.status == 200) {
    const resJson = await response.json();
    return resJson.auth;
  }
  return null;
};

const requestNonce = async (address_) => {
  try {
    const response = await fetch("/api/auth/req", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ address: address_ }),
    });
    const resJson = await response.json();
    return resJson.nonce;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const loadData = async (jwtToken) => {
  let res = await fetch("/api/user/", {
    method: "GET",
    headers: new Headers({
      Authorization: jwtToken,
      "Content-Type": "application/x-www-form-urlencoded",
    }),
  });
  let data = await res.json();
  console.log(data);
  return data;
};

const login = async (postAction, router) => {
  try {
    let walletResponse = await verifyWallet();
    if (walletResponse && walletResponse.length > 0) {
      // alert("Please install or login to Tronlink to proceed.");
      toast.warning("Please install or login to Tronlink to proceed.");
      return;
    }

    if (walletResponse.code != 200) {
      alert(res.message);
      return;
    }

    let address = await getAddress();
    if (!address) {
      // alert("Please install or login to Tronlink to proceed.");
      toast.warning("Please install or login to Tronlink to proceed.");
      return;
    }

    let nonce = await requestNonce(address);
    if (!nonce) {
      // alert("Please register your business to proceed.");
      toast.warning("Please register your business first to proceed.");
       router.push("/onboarding/business", { scroll: false });
      return;
    }

    let signature = await signUsingWallet(nonce);

    let auth = await verifySignature(signature, address);

    let data = await loadData(auth);

    postAction(auth, data);
  } catch (error) {
    console.error(error);
    // alert(error);
    toast.error(error);
  }
};

export default login;
