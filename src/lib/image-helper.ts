/**
 * Helper utility to normalize user-provided image URLs (e.g. Google Drive, Dropbox, Google Search, Pinterest, Imgur, Shopify, etc.)
 * into direct, raw, hotlinkable image URLs.
 */
export function normalizeImageUrl(url: string | null | undefined): string {
  if (!url) return '/placeholder.png';
  let cleanUrl = url.trim();
  if (!cleanUrl) return '/placeholder.png';

  // If already relative path (e.g. /placeholder.png), return as is
  if (cleanUrl.startsWith('/')) return cleanUrl;

  // Add protocol if missing
  if (cleanUrl.startsWith('//')) {
    cleanUrl = `https:${cleanUrl}`;
  } else if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://') && !cleanUrl.startsWith('data:')) {
    cleanUrl = `https://${cleanUrl}`;
  }

  try {
    const parsed = new URL(cleanUrl);

    // 1. Google Drive Links:
    // https://drive.google.com/file/d/1ABCXYZ/view?usp=sharing
    // https://drive.google.com/open?id=1ABCXYZ
    // https://drive.google.com/uc?id=1ABCXYZ
    if (parsed.hostname.includes('drive.google.com')) {
      let fileId = '';
      const match = parsed.pathname.match(/\/file\/d\/([^\/]+)/);
      if (match && match[1]) {
        fileId = match[1];
      } else {
        fileId = parsed.searchParams.get('id') || '';
      }
      if (fileId) {
        return `https://lh3.googleusercontent.com/d/${fileId}`;
      }
    }

    // 2. Dropbox Links:
    // https://www.dropbox.com/s/xyz/photo.jpg?dl=0 -> raw=1 or dl.dropboxusercontent.com
    if (parsed.hostname.includes('dropbox.com')) {
      return cleanUrl
        .replace('www.dropbox.com', 'dl.dropboxusercontent.com')
        .replace(/\?dl=[01]$/, '')
        .replace(/\?raw=1$/, '');
    }

    // 3. Google Search Redirect links:
    // https://www.google.com/imgres?imgurl=https%3A%2F%2Fexample.com%2Fimage.jpg...
    if (parsed.hostname.includes('google.') && parsed.pathname.includes('/imgres')) {
      const realImg = parsed.searchParams.get('imgurl');
      if (realImg) return normalizeImageUrl(realImg);
    }

    // 4. Imgur page links (e.g. https://imgur.com/abc -> https://i.imgur.com/abc.jpg)
    if (parsed.hostname === 'imgur.com' && parsed.pathname.length > 1 && !parsed.pathname.includes('.')) {
      return `https://i.imgur.com${parsed.pathname}.jpg`;
    }

    // 5. Postimg / Postimages page links
    if (parsed.hostname.includes('postimg.cc') && !parsed.pathname.includes('.')) {
      // postimg page links
      const match = parsed.pathname.match(/\/([a-zA-Z0-9]+)/);
      if (match && match[1]) {
        return `https://i.postimg.cc/${match[1]}/image.jpg`;
      }
    }

    // 6. Shopify CDN image size optimization (e.g. _100x100.jpg -> _800x800.jpg or original)
    if (parsed.hostname.includes('cdn.shopify.com')) {
      return cleanUrl.replace(/_([0-9]+x[0-9]*|_small|_thumb|_medium|_compact|_large|_1024x1024)\./i, '_800x.');
    }

  } catch (e) {
    // If URL parsing fails, return original clean URL
  }

  return cleanUrl;
}

/**
 * Helper to check if a URL is likely a HTML web page URL (e.g. product page link)
 * rather than a direct image file URL.
 */
export function isWebPageUrl(url: string): boolean {
  if (!url || !url.startsWith('http')) return false;
  try {
    const parsed = new URL(url);
    const path = parsed.pathname.toLowerCase();
    
    // Direct image extensions
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.avif', '.svg', '.bmp'];
    if (imageExtensions.some(ext => path.endsWith(ext))) {
      return false;
    }

    // Known direct image hosts
    if (
      parsed.hostname.includes('images.unsplash.com') ||
      parsed.hostname.includes('lh3.googleusercontent.com') ||
      parsed.hostname.includes('i.imgur.com') ||
      parsed.hostname.includes('i.postimg.cc') ||
      parsed.hostname.includes('i.pinimg.com') ||
      parsed.hostname.includes('cdn.shopify.com') ||
      parsed.hostname.includes('res.cloudinary.com')
    ) {
      return false;
    }

    // Standard product/webpage extensions or HTML paths
    return true;
  } catch {
    return false;
  }
}

