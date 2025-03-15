import { useEffect } from "react";
import { jumpToAnchor } from './scrollUtils';
import { setupAnchorDestinations, extractHashSlug } from './anchorSetup';

/**
 * AnchorLinks Component
 * Handles smooth scrolling to anchor points while accounting for fixed headers
 * Supports both regular anchor links and local anchor links
 */
const AnchorLinks = () => {
  useEffect(() => {
    /**
     * Handles clicks on anchor links
     * Uses event delegation for better performance
     * @param {Event} event - The click event
     */
    function handleAnchorClick(event) {
      // Use event delegation to check if clicked element is an anchor
      const link = event.target.closest('a[data-anchor], a[data-local="true"][data-anchor="true"]');
      if (!link) return;

      const hashSlug = extractHashSlug(link);
      if (!hashSlug) return;

      // Remove leading # if present
      const cleanHashSlug = hashSlug.replace(/^#/, '');

      if (window.location.pathname === link.pathname || link.dataset.local === 'true') {
        event.preventDefault();
        jumpToAnchor(cleanHashSlug);
      }
    }

    /**
     * Initializes anchor functionality
     * Sets up event listeners and processes anchor destinations
     */
    function initializeAnchors() {
      document.body.addEventListener("click", handleAnchorClick);
      setupAnchorDestinations();
    }

    // Handle initial hash if present
    if (window.location.hash) {
      const hashSlug = window.location.hash.substring(1);
      if (hashSlug) {
        const handleInitialHash = () => {
          setTimeout(() => {
            jumpToAnchor(hashSlug);
          }, 100);
        };

        if (document.readyState === 'complete') {
          handleInitialHash();
        } else {
          window.addEventListener('load', handleInitialHash, { once: true });
        }
      }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'complete') {
      initializeAnchors();
    } else {
      window.addEventListener('load', () => {
        initializeAnchors();
      });
    }

    // Cleanup function
    return () => {
      document.body.removeEventListener("click", handleAnchorClick);
    };
  }, []);

  return null;
};

export default AnchorLinks;
