const getStatusColor = (status: string) => {
  switch (status) {
    case "Accepted":
    case "Completed":
      return "green";
    case "Denied":
      return "red";
    case "Pending":
      return "#cf9033";
    case "Processing":
      return "#487EB0";
    default:
      return "#cf9033";
  }
};

export { getStatusColor };
