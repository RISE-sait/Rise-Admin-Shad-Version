export const sanitizeTextInput = (value: string) =>
  value.replace(/[^a-zA-Z0-9\s,.'-]/g, "");

export const TEAM_TEXT_INPUT_PATTERN = /^[a-zA-Z0-9\s,.'-]*$/;
export const TEAM_TEXT_INPUT_PATTERN_STRING = "[a-zA-Z0-9\\s,.'-]*";

export const tryCreateSearchRegex = (value: string) => {
  if (!value) {
    return null;
  }

  try {
    return new RegExp(value, "i");
  } catch (error) {
    return null;
  }
};

export const matchesSearchQuery = (query: string, value?: string | null) => {
  if (!value) {
    return false;
  }

  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    return true;
  }

  const regex = tryCreateSearchRegex(trimmedQuery);
  if (regex) {
    return regex.test(value);
  }

  return value.toLowerCase().includes(trimmedQuery.toLowerCase());
};
