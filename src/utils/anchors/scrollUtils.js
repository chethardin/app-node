import { getHeaderOffset } from './headerOffset';

/**
 * Scrolls the page to the specified anchor target
 * Accounts for header offset and ensures smooth scrolling
 * @param {string} hashSlug - The ID of the target element
 */
export async function jumpToAnchor(hashSlug) {
  if (!hashSlug) {
    console.warn('No hash provided to jumpToAnchor');
    return;
  }

  // Wait for next frame to ensure DOM is ready
  await new Promise(resolve => requestAnimationFrame(resolve));

  // Clean the hashSlug to ensure it's just the ID
  const cleanHash = hashSlug.split('#').pop();

  // Find target element by data-id or id
  const target = document.querySelector(`[data-id='${cleanHash}'], #${cleanHash}`);
  
  if (!target) {
    console.warn(`Anchor destination ${cleanHash} does not exist on this page.`);
    return;
  }

  // Calculate header offset and position
  const headerOffset = getHeaderOffset();
  const rect = target.getBoundingClientRect();
  const absoluteTop = rect.top + window.pageYOffset;
  const targetPosition = absoluteTop - headerOffset;

  // Smooth scroll to target position
  window.scrollTo({
    top: targetPosition,
    behavior: "smooth"
  });

  // Wait for scroll to complete
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Set focus for accessibility
  target.setAttribute("tabindex", "-1");
  target.focus();
} 