/**
 * Sets up anchor destinations by converting IDs to data attributes
 * This allows for better handling of anchor links while maintaining accessibility
 */
export function setupAnchorDestinations() {
  const anchorDests = document.querySelectorAll(".anchor-dest");

  anchorDests.forEach(dest => {
    if (!dest.dataset.anchorParsed) {
      const anchorID = dest.id;
      if (anchorID) {
        // Convert ID to data attribute
        dest.dataset.id = anchorID;
        dest.removeAttribute("id");
        
        // Set up accessibility attributes
        dest.setAttribute("tabindex", "-1");
        dest.dataset.anchorParsed = true;
      }
    }
  });
}

/**
 * Extracts the hash slug from an anchor link
 * Handles both local and external anchor links
 * @param {HTMLElement} link - The anchor element
 * @returns {string|null} The extracted hash slug or null if invalid
 */
export function extractHashSlug(link) {
  if (link.dataset.local === 'true' && link.dataset.anchor === 'true') {
    // For local anchors, get just the hash part or the href itself
    const href = link.getAttribute('href');
    return href.includes('#') ? href.split('#').pop() : href;
  }

  // For regular anchors, extract from URL
  try {
    return new URL(link.href).hash.substring(1);
  } catch (e) {
    console.warn('Invalid URL:', link.href);
    return null;
  }
} 