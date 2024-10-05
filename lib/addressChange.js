const monitorAddressChange = (onChange) => {
  window.addEventListener("message", function (e) {
    if (e.data.message && e.data.message.action == "accountsChanged") {
      // handler logic
      console.log("got accountsChanged event", e.data.message.data.address);
      onChange();
    }
  });
};

const stopAddressChangeMonitor = () => {
  window.removeEventListener("message", function (e) {
    if (e.data.message && e.data.message.action == "accountsChanged") {
      // handler logic
      console.log("got accountsChanged event", e.data.message.data.address);
    }
  });
};

export { monitorAddressChange, stopAddressChangeMonitor };
