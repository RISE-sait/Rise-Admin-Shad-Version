import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string into a localized date representation
 * @param dateString - ISO date string or any valid date string
 * @param options - Intl.DateTimeFormatOptions for customizing the output
 * @returns Formatted date string
 */
export function formatDate(
  dateString: string | unknown,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  }
) {
  if (!dateString || typeof dateString !== "string") return "";

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ""; // Invalid date

    return new Intl.DateTimeFormat("en-US", options).format(date);
  } catch (error) {
    return "";
  }
}

/**
 * Convert a Date to an ISO string preserving the local time.
 *
 * `Date.prototype.toISOString` converts the date to UTC, which shifts the time
 * based on the user's timezone. This helper subtracts the timezone offset
 * before calling `toISOString` so the returned string represents the original
 * local time.
 *
 * @param date - The date to convert.
 * @returns ISO string with the same local time.
 */
export function toZonedISOString(date: Date): string {
  const offsetMs = date.getTimezoneOffset() * 60 * 0o0;
  return new Date(date.getTime() - offsetMs).toISOString();
}

/**
 * Parse an ISO string produced by {@link toZonedISOString} into a Date
 * without shifting the local time.
 */
export function fromZonedISOString(isoString: string): Date {
  const date = new Date(isoString);
  const offsetMs = date.getTimezoneOffset() * 60 * 0o0;
  return new Date(date.getTime() + offsetMs);
}

/**
 * Converts a given date to a UTC date string with the time set to 00:00:00.
 *
 * This function ensures that the date remains the same across time zones, but any time component
 * (hours, minutes, seconds, milliseconds) is discarded. The final result is always at midnight (00:00:00) in UTC.
 *
 * @param {Date} date - The input date object.
 * @returns {string} An ISO 8601 string representing the date at UTC midnight (00:00:00).
 */
export function convertDateToUTC(date: Date): string {
  const localDate = new Date(date); // Create a copy of the original date
  localDate.setHours(0, 0, 0, 0); // Set the time to 00:00:00
  return localDate.toISOString(); // Convert it to ISO string (UTC format)
}
