const checkNetwork = async (onSuccess, onFailure) => {
  if (window.tronWeb && window.tronWeb.ready) {
    const tronNetwork = window.tronWeb.fullNode.host; // Get the current TronLink network
    const expectedNetwork = process.env.NEXT_PUBLIC_TRON_NETWORK; // Get the expected network from environment

    if (!tronNetwork.includes(expectedNetwork)) {
      // alert(
      //   `You're currently connected to a different network on TronLink. Please switch to ${process.env.NEXT_PUBLIC_TRON_NETWORK_NAME} to continue.`
      // );
    } else {
      console.log("Network is correct");
      onSuccess();
      return true;
    }
  }
  onFailure();
  return false;
};

const monitorNetwork = (onSuccess, onFailure) => {
  window.addEventListener("message", function (e) {
    if (e.data.message && e.data.message.action == "setNode") {
      // handler logic
      console.log("got setNode event", e.data.message.data.node.fullNode);
      checkNetwork(onSuccess, onFailure);
    }
  });
};

const stopNetworkMonitor = () => {
  window.removeEventListener("message", function (e) {
    if (e.data.message && e.data.message.action == "setNode") {
      // handler logic
      console.log("got setNode event", e.data.message.data.node.fullNode);
    }
  });
};

export { checkNetwork, monitorNetwork, stopNetworkMonitor };
