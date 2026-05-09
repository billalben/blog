export const genUsername = () => {
  const usernamePrefix = "user-";
  const randomSuffix = Math.random().toString(36).substring(2, 8); // Generate a random string of 6 characters

  return usernamePrefix + randomSuffix;
};
