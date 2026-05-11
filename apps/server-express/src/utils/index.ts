export const genUsername = () => {
  const usernamePrefix = "user-";
  const randomSuffix = Math.random().toString(36).substring(2, 8); // Generate a random string of 6 characters

  return usernamePrefix + randomSuffix;
};

export const genSlug = (title: string) => {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric characters with hyphens
    .replace(/^-+|-+$/g, "") // Remove leading and trailing hyphens
    .replace(/-{2,}/g, "-"); // Replace multiple hyphens with a single hyphen

  const randomChars = Math.random().toString(36).substring(2, 8); // Generate a random string of 6 characters
  const uniqueSlug = `${slug}-${randomChars}`; // Append random string to ensure uniqueness

  return uniqueSlug;
};
