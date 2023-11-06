export const getAuthMethod = () => {
  if (process.env.REACT_APP_IS_ANALYTICS_DISABLED == "TRUE") {
    return "Cognito";
  }

  return "Cognito";
};
