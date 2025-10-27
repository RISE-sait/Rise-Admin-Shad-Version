export const TEXT_PATTERN = /^[A-Za-z0-9\s.,'&()\-\/]{1,120}$/;
export const TEXT_PATTERN_MESSAGE =
  "Use 1-120 characters with letters, numbers, spaces, and basic punctuation (.,'&()-/).";

export const MULTILINE_TEXT_PATTERN = /^[A-Za-z0-9\s.,'&()\-\/;\n]{1,500}$/;
export const MULTILINE_TEXT_MESSAGE =
  "Use up to 500 characters with letters, numbers, spaces, new lines, and basic punctuation (including semicolons).";

export const NUMBER_PATTERN = /^[0-9]+$/;
export const NUMBER_PATTERN_MESSAGE = "Enter a whole number using digits only.";

export const STRIPE_PRICE_PATTERN = /^price_[A-Za-z0-9]+$/;
export const STRIPE_PRICE_MESSAGE =
  "Stripe price IDs must start with 'price_' followed by letters or numbers.";

export function sanitizeSingleLineInput(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function sanitizeMultilineInput(value: string): string {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter((line, index, all) => line.length > 0 || index === all.length - 1)
    .join("\n")
    .trim();
}

export function sanitizeStripePriceId(value: string): string {
  return value.trim();
}
