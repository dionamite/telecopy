export const clean = (raw) => {
  // Step 1: Strip wrapping quotes
  let cleaned = raw.trim().replace(/^"|"$/g, "");

  // Step 2: Unescape the escaped quotes
  cleaned = cleaned.replace(/\\"/g, '"');

  // Step 3: Remove literal \n and extra whitespace
  cleaned = cleaned.replace(/\\n/g, " ").replace(/\s+/g, " ").trim();

  return cleaned;
};

export const createHashId = () => {
  return crypto.randomUUID();
};
