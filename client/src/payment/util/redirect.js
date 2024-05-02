
export const getRedirectUrl = (resultCode) => {
  switch (resultCode) {
    case "Authorised":
      return "/status/success";
    case "Pending":
    case "Received":
      return "/status/pending";
    case "Refused":
      return "/status/failed";
    default:
      return "/status/error";
  }
}
