import { gql } from '@apollo/client';

/**
 * GraphQL query to fetch anchor data from WordPress
 * Retrieves the anchor slug and target page information
 */
export const GET_ANCHOR_DATA = gql`
  query GetAnchor($id: ID!) {
    anchor(id: $id, idType: URI) {
      anchorCustomFields {
        anchorSlug
        anchorPage {
          nodes {
            link
          }
        }
      }
    }
  }
`;

/**
 * Checks if content needs anchor processing
 * @param {string} content - The HTML content to check
 * @returns {boolean} True if content contains anchor references
 */
export function shouldProcessContent(content) {
  return typeof content === 'string' && content.includes('/anchor/');
}

/**
 * Extracts all anchor tag matches from content
 * Finds anchor tags that reference the anchor custom post type
 * @param {string} content - The HTML content to process
 * @returns {Array} Array of regex matches containing anchor tag parts
 */
export function getAnchorMatches(content) {
  const matches = [...content.matchAll(/<a([^>]*?)href="([^"]*?\/anchor\/[^"]*?)"([^>]*?)>/g)];
  return matches;
}

/**
 * Creates a new anchor tag with proper attributes
 * Converts WordPress anchor references to page-specific links
 * @param {Object} data - The anchor data from WordPress
 * @param {string} fullMatch - The original anchor tag
 * @param {string} before - Content before href in anchor tag
 * @param {string} after - Content after href in anchor tag
 * @param {string} currentPath - Current page path
 * @returns {Object|null} Object with original and replacement strings, or null if invalid
 */
export function createNewAnchor(data, fullMatch, before, after, currentPath) {
  // Check if we have valid anchor data
  if (!data?.anchor?.anchorCustomFields) {
    console.warn('Invalid anchor data received from WordPress');
    return null;
  }

  const { anchorSlug, anchorPage } = data.anchor.anchorCustomFields;
  const targetPage = anchorPage?.nodes?.[0]?.link;

  // Ensure we have both required pieces of data
  if (!targetPage || !anchorSlug) {
    console.warn('Missing required anchor data:', { targetPage, anchorSlug });
    return null;
  }

  // Determine if this is a local (same-page) link
  const isLocalPage = targetPage === currentPath;
  const newHref = isLocalPage ? `#${anchorSlug}` : `${targetPage}#${anchorSlug}`;
  const localAttr = isLocalPage ? ' data-local="true"' : '';

  return {
    original: fullMatch,
    replacement: `<a${before}href="${newHref}"${after} data-anchor="true"${localAttr}>`
  };
}

/**
 * Processes a single anchor match
 * Fetches anchor data and creates new anchor tag
 * @param {Array} match - Regex match array containing anchor parts
 * @param {ApolloClient} client - Apollo Client instance
 * @param {string} currentPath - Current page path
 * @returns {Object|null} Object with original and replacement strings, or null if invalid
 */
export async function processAnchorMatch(match, client, currentPath) {
  const [fullMatch, before, href, after] = match;
  const anchorPath = href.split('/anchor/')[1];
  
  if (!anchorPath) {
    console.warn('Invalid anchor path in href:', href);
    return null;
  }

  try {
    // Fetch anchor data from WordPress
    const { data } = await client.query({
      query: GET_ANCHOR_DATA,
      variables: { id: `/anchor/${anchorPath}` }
    });

    return createNewAnchor(data, fullMatch, before, after, currentPath);
  } catch (error) {
    console.error('Error fetching anchor data:', {
      error,
      anchorPath,
      href
    });
    return null;
  }
}

/**
 * Processes all anchor matches in content
 * Main entry point for anchor processing
 * @param {string} content - The HTML content to process
 * @param {ApolloClient} client - Apollo Client instance
 * @param {string} currentPath - Current page path
 * @returns {string} Processed content with updated anchor tags
 */
export async function processAnchorMatches(content, client, currentPath) {
  let newContent = content;
  const anchorMatches = getAnchorMatches(content);

  // Process each anchor match sequentially
  let processedCount = 0;
  for (const match of anchorMatches) {
    const result = await processAnchorMatch(match, client, currentPath);
    if (result) {
      newContent = newContent.replace(result.original, result.replacement);
      processedCount++;
    }
  }

  return newContent;
} 