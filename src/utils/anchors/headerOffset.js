/**
 * Gets the header offset from CSS custom property --header-offset
 * Used to adjust scroll position to account for fixed header
 * @returns {number} Header offset in pixels, defaults to 0 if not set
 */
export function getHeaderOffset() {
  const style = getComputedStyle(document.body);
  let headerOffset = style.getPropertyValue("--header-offset");
  return headerOffset ? parseInt(headerOffset.replace(/\D/g, ""), 10) : 0;
} 