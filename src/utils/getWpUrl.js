export function getWpUrl() {
  // Check for environment variables in order of preference
  const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || 
                process.env.WORDPRESS_URL ||
                process.env.NEXT_PUBLIC_WORDPRESS_SITE_URL ||
                process.env.WORDPRESS_SITE_URL;

  if (!wpUrl) {
    console.warn('WordPress URL not found in environment variables');
    return '';
  }

  // Remove trailing slash if present
  return wpUrl.replace(/\/$/, '');
} 