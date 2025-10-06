export const sanitizeTextInput = (value: string) =>
  value.replace(/[^a-zA-Z0-9\s,.'-]/g, "");
