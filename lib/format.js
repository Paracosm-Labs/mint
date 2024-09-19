const formatDate = (date) => {
  if (!date) {
    return "";
  }
  // Get components of the date
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(date.getDate()).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2); // Get last 2 digits of the year
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  // Format the date string as MM/dd/yy HH:mm
  return `${month}/${day}/${year} ${hours}:${minutes}`;
};

// Example usage
const date = new Date();
console.log(formatDate(date)); // Outputs: "09/12/24 14:35" (example)

export { formatDate };
