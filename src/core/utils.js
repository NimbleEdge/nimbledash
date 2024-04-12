export const getAuthMethod = () => {
  if (process.env.REACT_APP_IS_ANALYTICS_DISABLED == "TRUE") {
    return "Cognito";
  }

  return "Cognito";
};

export const makeNumberCompact = (num) => {
  return Intl.NumberFormat('en-US', {
    notation: "compact",
    maximumFractionDigits: 2
  }).format(num);
}