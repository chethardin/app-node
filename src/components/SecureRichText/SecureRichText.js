import DOMPurify from 'isomorphic-dompurify';
import { usePageLink } from '../../context/PageContext';
import { useApolloClient } from '@apollo/client';
import { useState, useEffect } from 'react';
import { 
  shouldProcessContent, 
  processAnchorMatches 
} from './utils/anchorProcessor';

/**
 * SecureRichText Component
 * Renders sanitized HTML content and processes any anchor links within it.
 * Converts WordPress anchor references to proper page links while maintaining security.
 *
 * @param {Object} props - Component props
 * @param {string} props.content - Raw HTML content to process and render
 * @param {string} [props.className] - Optional CSS class name
 * @param {string|Component} [props.as='div'] - Element or component to render as
 */
const SecureRichText = ({ content, className, as: Element = 'div' }) => {
  const currentPath = usePageLink();
  const client = useApolloClient();
  const [processedContent, setProcessedContent] = useState(content);

  useEffect(() => {
    /**
     * Processes anchor tags in content
     * Converts WordPress anchor references to proper page links
     */
    const processAnchors = async () => {
      // Skip processing if no anchors to process
      if (!shouldProcessContent(content)) {
        setProcessedContent(content);
        return;
      }

      try {
        // Process all anchor matches in the content
        const newContent = await processAnchorMatches(content, client, currentPath);
        setProcessedContent(newContent);
      } catch (error) {
        // Log error and fallback to original content for resilience
        console.error('Failed to process anchor links:', {
          error,
          contentLength: content?.length,
          currentPath
        });
        setProcessedContent(content);
      }
    };

    processAnchors();
  }, [content, currentPath, client]); // Re-run when content, path, or client changes

  // Sanitize processed content before rendering
  const sanitizedContent = DOMPurify.sanitize(processedContent);

  return (
    <Element 
      {...(className && { className })}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};

export default SecureRichText;

