import { NextResponse } from 'next/server';
import { normalizeImageUrl } from '@/lib/image-helper';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    let cleanInputUrl = url.trim();
    if (cleanInputUrl.startsWith('//')) {
      cleanInputUrl = `https:${cleanInputUrl}`;
    } else if (!cleanInputUrl.startsWith('http://') && !cleanInputUrl.startsWith('https://')) {
      cleanInputUrl = `https://${cleanInputUrl}`;
    }

    // 1. Try initial normalization (for Google Drive, Dropbox, Imgur, Google Search redirect, etc.)
    const normalizedDirect = normalizeImageUrl(cleanInputUrl);

    // If it's a known direct image host or direct file extension
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif', '.svg'];
    const isDirectExtension = imageExtensions.some((ext) =>
      normalizedDirect.toLowerCase().includes(ext)
    );

    const isKnownImageHost =
      normalizedDirect.includes('images.unsplash.com') ||
      normalizedDirect.includes('lh3.googleusercontent.com') ||
      normalizedDirect.includes('dl.dropboxusercontent.com') ||
      normalizedDirect.includes('i.imgur.com') ||
      normalizedDirect.includes('i.postimg.cc') ||
      normalizedDirect.includes('cdn.shopify.com');

    // If already direct image URL, return immediately
    if (isDirectExtension || isKnownImageHost) {
      return NextResponse.json({
        success: true,
        imageUrl: normalizedDirect,
        isDirect: true,
      });
    }

    // 2. Fetch the Web Page HTML to extract Open Graph / Meta image
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(cleanInputUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return NextResponse.json({
        success: true,
        imageUrl: normalizedDirect,
        warning: 'Could not fetch link HTML directly, returning normalized URL.',
      });
    }

    const html = await response.text();

    let extractedImg: string | null = null;
    let extractedTitle: string | null = null;
    let extractedPrice: string | null = null;

    // A. Extract OG Image / Twitter Image / Link Rel Image
    const ogImageMatch =
      html.match(/<meta[^>]*property=["']og:image:secure_url["'][^>]*content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image:secure_url["']/i) ||
      html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i) ||
      html.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:image["']/i) ||
      html.match(/<link[^>]*rel=["']image_src["'][^>]*href=["']([^"']+)["']/i);

    if (ogImageMatch && ogImageMatch[1]) {
      extractedImg = ogImageMatch[1];
    }

    // B. JSON-LD Image match if og:image wasn't found
    if (!extractedImg) {
      const jsonLdMatch = html.match(/"image"\s*:\s*["']([^"']+)["']/i);
      if (jsonLdMatch && jsonLdMatch[1]) {
        extractedImg = jsonLdMatch[1];
      }
    }

    // C. First large product img tag fallback
    if (!extractedImg) {
      const imgMatch = html.match(/<img[^>]+src=["']([^"']+\.(?:jpg|jpeg|png|webp|avif))["']/i);
      if (imgMatch && imgMatch[1]) {
        extractedImg = imgMatch[1];
      }
    }

    // D. Extract Product Title
    const titleMatch =
      html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:title["']/i) ||
      html.match(/<title>([^<]+)<\/title>/i);
    if (titleMatch && titleMatch[1]) {
      extractedTitle = titleMatch[1].trim().replace(/\s+/g, ' ');
    }

    // E. Extract Price if available
    const priceMatch =
      html.match(/<meta[^>]*property=["']og:price:amount["'][^>]*content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]*property=["']product:price:amount["'][^>]*content=["']([^"']+)["']/i) ||
      html.match(/"price"\s*:\s*["']?([0-9]+(?:\.[0-9]+)?)["']?/i);
    if (priceMatch && priceMatch[1]) {
      extractedPrice = priceMatch[1];
    }

    if (extractedImg) {
      // Resolve relative image URLs to absolute URLs
      try {
        if (extractedImg.startsWith('//')) {
          extractedImg = `https:${extractedImg}`;
        } else if (!extractedImg.startsWith('http://') && !extractedImg.startsWith('https://')) {
          extractedImg = new URL(extractedImg, cleanInputUrl).href;
        }
      } catch (e) {
        // preserve original
      }

      const finalNormalizedImg = normalizeImageUrl(extractedImg);

      return NextResponse.json({
        success: true,
        imageUrl: finalNormalizedImg,
        title: extractedTitle,
        price: extractedPrice,
        extracted: true,
      });
    }

    // Fallback if no specific meta image found in HTML
    return NextResponse.json({
      success: true,
      imageUrl: normalizedDirect,
      title: extractedTitle,
      price: extractedPrice,
      extracted: false,
    });
  } catch (error: any) {
    console.error('Error extracting image from URL:', error);
    return NextResponse.json(
      {
        success: true,
        imageUrl: normalizeImageUrl(req.url),
        warning: error?.message || 'Extraction failed',
      },
      { status: 200 }
    );
  }
}
