const checkUserExists = async (address) => {
  const response = await fetch("/api/user/check", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      address: address,
    }),
  });
  const data = await response.json();
  console.log(data);
  return data.success;
};

export {checkUserExists};
