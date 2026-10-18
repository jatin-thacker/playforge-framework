/**
 * Date calculation and formatting helpers for test inputs.
 */

/**
 * Formats a Date object as ISO YYYY-MM-DD.
 * @param {Date} [date=new Date()]
 * @returns {string}
 */
export function formatIsoDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Returns a new Date offset by a number of days.
 * @param {Date} date
 * @param {number} days
 * @returns {Date}
 */
export function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Returns an ISO date string for N days in the future.
 * @param {number} [days=7]
 * @returns {string}
 */
export function getFutureDate(days = 7) {
  return formatIsoDate(addDays(new Date(), days));
}

/**
 * Formats a date into human-readable string (e.g. "18 Oct 2026").
 * @param {Date} [date=new Date()]
 * @returns {string}
 */
export function formatDisplayDate(date = new Date()) {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
