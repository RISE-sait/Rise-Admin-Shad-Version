/**
 * Formats an ISO 8601 date string into a human-readable format.
 *
 * @param {string} isoString - The ISO date string (e.g., "2025-03-08T01:07:48.652618Z").
 * @returns {string} A formatted date string (e.g., "March 7, 2025, 6:07 PM MST").
 *
 * @example
 * const formattedDate = formatDate("2025-03-08T01:07:48.652618Z");
 * console.log(formattedDate); // Output: "March 7, 2025, 6:07 PM MST"
 */
function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  }).format(date);
}

/**
 * Parses various date string formats used by the backend into a Date object.
 *
 * This handles duplicated timezone offsets and several common formats such as:
 * - "YYYY-MM-DD HH:MM:SS -0700 MST"
 * - "YYYY-MM-DD HH:MM:SS -0600"
 * - ISO strings
 * - Generic date strings
 *
 * @param dateString Date string from the backend
 * @returns Parsed Date or null if parsing fails
 */
function parseEventDate(dateString: string): Date | null {
  if (!dateString || dateString.trim() === "") {
    console.warn("Empty or null date string provided");
    return null;
  }

  let cleanedString = dateString.trim();

  // Fix duplicate timezone offsets like "-0600 -0600"
  const duplicateTimezonePattern = /(-0[67]00)\s+(-0[67]00)$/;
  if (duplicateTimezonePattern.test(cleanedString)) {
    cleanedString = cleanedString.replace(duplicateTimezonePattern, "$1");
  }

  let parsedDate: Date;

  if (
    cleanedString.includes("T") &&
    (cleanedString.includes("Z") || cleanedString.includes("+"))
  ) {
    // Already in ISO format
    parsedDate = new Date(cleanedString);
  } else if (
    cleanedString.includes(" MST") ||
    (cleanedString.includes(" -0700") && !cleanedString.includes("T"))
  ) {
    // "YYYY-MM-DD HH:MM:SS -0700 MST"
    const isoString = cleanedString
      .replace(" MST", "")
      .replace(" -0700", "-07:00")
      .replace(" ", "T");
    parsedDate = new Date(isoString);
  } else if (
    cleanedString.includes(" MDT") ||
    (cleanedString.includes(" -0600") && !cleanedString.includes("T"))
  ) {
    // "YYYY-MM-DD HH:MM:SS -0600"
    const isoString = cleanedString
      .replace(" MDT", "")
      .replace(" -0600", "-06:00")
      .replace(" ", "T");
    parsedDate = new Date(isoString);
  } else if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(cleanedString)) {
    // Generic "YYYY-MM-DD HH:MM:SS"
    const isoString = cleanedString.replace(" ", "T");
    parsedDate = new Date(isoString);
  } else {
    parsedDate = new Date(cleanedString);
  }

  if (isNaN(parsedDate.getTime())) {
    console.error("Failed to parse date:", dateString);
    return null;
  }

  return parsedDate;
}

export { formatDate, parseEventDate };
