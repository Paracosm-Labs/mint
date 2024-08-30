import { getAddress, signUsingWallet, verifyWallet } from './wallet';

const verifySignature = async (signature, address) =>{
    const response = await fetch('/api/auth/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sign: signature, address : address }),
    });
    if(response.status == 200){
      const resJson = await response.json();
      return resJson.auth;
    }
    return null;
  }

const requestNonce = async (address_) => {
    const response = await fetch('/api/auth/req', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ address: address_ }),
    });
    const resJson = await response.json();
    return resJson.nonce;
}

const login = (postAction) => {
    verifyWallet().then(res => {
      if(!res || res.length == 0){
        alert("Please install or login to Tronlink to proceed.");
        return;
      }
      if(res.code != 200){
        alert(res.message);
        return;
      }
      getAddress().then(address => {
        if(address){
          requestNonce(address).then(nonce => {
            if(nonce){
              signUsingWallet(nonce).then(signature => {
                verifySignature(signature, address).then((auth) => {
                  postAction(auth);
                });
              });
              
            } else throw new Error(("Cannot get nonce"));
          });
        } else throw new Error(("Cannot get address"));
      }); 
    }).catch(err =>{
      console.error(err);
    })
  }

  export default login;