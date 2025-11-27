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
 * Convert a Date to an ISO string with the local timezone offset.
 *
 * `Date.prototype.toISOString` converts the date to UTC with 'Z' suffix.
 * This helper outputs the local time with the correct timezone offset
 * (e.g., "2025-10-24T09:00:00-07:00" for MST).
 *
 * @param date - The date to convert.
 * @returns ISO string with timezone offset (e.g., "2025-10-24T09:00:00-07:00").
 */
export function toZonedISOString(date: Date): string {
  const offsetMinutes = date.getTimezoneOffset();
  const offsetHours = Math.floor(Math.abs(offsetMinutes) / 60);
  const offsetMins = Math.abs(offsetMinutes) % 60;
  const offsetSign = offsetMinutes <= 0 ? '+' : '-';
  const offsetStr = `${offsetSign}${String(offsetHours).padStart(2, '0')}:${String(offsetMins).padStart(2, '0')}`;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}${offsetStr}`;
}

/**
 * Parse an ISO string produced by {@link toZonedISOString} into a Date
 * without shifting the local time.
 */
export function fromZonedISOString(isoString: string): Date {
  const date = new Date(isoString);
  const offsetMs = date.getTimezoneOffset() * 60 * 1000;
  return new Date(date.getTime() + offsetMs);
}

/**
 * Convert a Date to an ISO string for datetime-local inputs.
 *
 * Useful for pre-filling `datetime-local` input values without shifting
 * the visible time. Returns format "YYYY-MM-DDTHH:mm" without timezone.
 *
 * @param date - The date to convert.
 * @returns ISO string without timezone for datetime-local inputs.
 */
export function toLocalISOString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}`;
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
