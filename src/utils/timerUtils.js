/**
 * Set a status message that auto-clears after a delay
 * @param {Function} setStatusFn - The state setter function for the status message
 * @param {string} message - The message to display
 * @param {number} [delay=3000] - Delay in milliseconds before clearing
 */
export const setTimedStatus = (setStatusFn, message, delay = 3000) => {
  setStatusFn(message);
  setTimeout(() => setStatusFn(''), delay);
}; 