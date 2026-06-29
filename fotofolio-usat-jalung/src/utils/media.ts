/**
 * Utility to parse, normalize and clean media URLs.
 * Automatically converts Instagram posts/reels, Google Drive links, 
 * and Dropbox links into direct, embeddable image CDN URLs.
 */
export function cleanMediaUrl(url: string): string {
  if (!url) return '';
  let cleaned = url.trim();

  // 1. Handle Instagram Posts, Reels & TV
  // Match patterns like: https://www.instagram.com/p/C6Z7f3yM8x9/ or https://instagram.com/reel/C57ZlJyS8_x/?igsh=...
  const instaRegex = /(?:instagram\.com)\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/i;
  const instaMatch = cleaned.match(instaRegex);
  if (instaMatch && instaMatch[1]) {
    // Instagram public media redirection endpoint
    return `https://www.instagram.com/p/${instaMatch[1]}/media/?size=l`;
  }

  // 2. Handle Google Drive Shared Links
  // Match patterns like: https://drive.google.com/file/d/1A2B3C_4D5E/view?usp=sharing
  // or https://drive.google.com/open?id=1A2B3C_4D5E
  if (cleaned.includes('drive.google.com')) {
    const driveIdMatch = cleaned.match(/\/file\/d\/([A-Za-z0-9_-]+)/i) || cleaned.match(/[?&]id=([A-Za-z0-9_-]+)/i);
    if (driveIdMatch && driveIdMatch[1]) {
      // Use the ultra-reliable direct Google CDN link that bypasses all security scan warnings and frame/cors blocks
      return `https://lh3.googleusercontent.com/d/${driveIdMatch[1]}`;
    }
  }

  // 3. Handle Dropbox Shared Links
  // Match patterns like: https://www.dropbox.com/s/abcdefg123456/photo.jpg?dl=0
  if (cleaned.includes('dropbox.com')) {
    let dbUrl = cleaned.replace('www.dropbox.com', 'dl.dropboxusercontent.com');
    dbUrl = dbUrl.replace(/[?&]dl=[01]/, '');
    if (!dbUrl.includes('?')) {
      dbUrl += '?raw=1';
    } else if (!dbUrl.includes('raw=1')) {
      dbUrl += '&raw=1';
    }
    return dbUrl;
  }

  // 4. Handle Google Photos Direct Content URL Optimization
  // If they pasted a direct lh3.googleusercontent.com link, append high-res tag if not present
  if (cleaned.includes('googleusercontent.com') && !cleaned.includes('=')) {
    return `${cleaned}=s1200`;
  }

  return cleaned;
}
