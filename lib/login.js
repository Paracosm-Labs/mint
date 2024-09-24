// import { getAddress, signUsingWallet, verifyWallet } from "./wallet";
// import { toast } from "react-toastify";

// const verifySignature = async (signature, address) => {
//   const response = await fetch("/api/auth/verify", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ sign: signature, address: address }),
//   });
//   if (response.status == 200) {
//     const resJson = await response.json();
//     return resJson.auth;
//   }
//   return null;
// };

// const requestNonce = async (address_) => {
//   try {
//     const response = await fetch("/api/auth/req", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ address: address_ }),
//     });
//     const resJson = await response.json();
//     return resJson.nonce;
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// };

// const loadData = async (jwtToken) => {
//   let res = await fetch("/api/user/", {
//     method: "GET",
//     headers: new Headers({
//       Authorization: jwtToken,
//       "Content-Type": "application/x-www-form-urlencoded",
//     }),
//   });
//   let data = await res.json();
//   console.log(data);
//   return data;
// };

// const login = async (postAction) => {
//   try {
//     let walletResponse = await verifyWallet();
//     if (walletResponse && walletResponse.length > 0) {
//       // alert("Please install or login to Tronlink to proceed.");
//       toast.warning("Please install or login to Tronlink to proceed.");
//       return;
//     }

//     if (walletResponse.code != 200) {
//       alert(res.message);
//       return;
//     }

//     let address = await getAddress();
//     if (!address) {
//       // alert("Please install or login to Tronlink to proceed.");
//       toast.warning("Please install or login to Tronlink to proceed.");
//       return;
//     }

//     let nonce = await requestNonce(address);
//     if (!nonce) {
//       // alert("Please register your business to proceed.");
//       toast.warning("Please register your business first to proceed.");
//       return;
//     }

//     let signature = await signUsingWallet(nonce);

//     let auth = await verifySignature(signature, address);

//     let data = await loadData(auth);

//     postAction(auth, data);
//   } catch (error) {
//     console.error(error);
//     // alert(error);
//     toast.error(error);
//   }
// };

// export default login;

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

  if (response.ok) {
    const resJson = await response.json();
    return resJson.auth; // Ensure this is structured as expected
  } else {
    toast.error("Failed to verify signature.");
    return null;
  }
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
    toast.error("Error requesting nonce.");
    throw error;
  }
};

const loadData = async (jwtToken) => {
  try {
    const res = await fetch("/api/user/", {
      method: "GET",
      headers: {
        Authorization: jwtToken,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    if (!res.ok) {
      throw new Error("Failed to load user data.");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    toast.error("Error loading user data.");
    throw error;
  }
};

const login = async (postAction) => {
  try {
    const walletResponse = await verifyWallet();
    
    if (!walletResponse || walletResponse.length === 0) {
      toast.warning("Please install or login to Tronlink to proceed.");
      return;
    }

    if (walletResponse.code !== 200) {
      toast.error(walletResponse.message || "Unknown wallet error.");
      return;
    }

    const address = await getAddress();
    if (!address) {
      toast.warning("Please install or login to Tronlink to proceed.");
      return;
    }

    const nonce = await requestNonce(address);
    if (!nonce) {
      toast.warning("Please register your business first to proceed.");
      return;
    }

    const signature = await signUsingWallet(nonce);
    const auth = await verifySignature(signature, address);
    
    if (!auth) {
      toast.error("Signature verification failed.");
      return;
    }

    const data = await loadData(auth);
    postAction(auth, data);
  } catch (error) {
    console.error(error);
    toast.error(error.message || "An unexpected error occurred.");
  }
};

export default login;
