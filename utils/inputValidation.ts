export const sanitizeTextInput = (value: string) =>
  value.replace(/[^a-zA-Z0-9\s,.'-]/g, "");

export const TEAM_TEXT_INPUT_PATTERN = /^[a-zA-Z0-9\s,.'-]*$/;
export const TEAM_TEXT_INPUT_PATTERN_STRING = "[a-zA-Z0-9\\s,.'-]*";
