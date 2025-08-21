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

export { formatDate };
