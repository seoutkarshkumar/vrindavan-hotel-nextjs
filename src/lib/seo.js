/**
 * Automatic SEO Rules Engine:
 * 1. Self-referencing Canonical URLs (always https, strips tracking params, consistent trailing slash `/`)
 * 2. Smart fallback for Title, Description, Open Graph, Twitter Card
 * 3. JSON-LD Schema Generators (Hotel + LocalBusiness, FAQPage, BreadcrumbList, Article, Room/Offer)
 */

import { safeJsonParse } from './sanitize';

export function normalizeDomain(rawDomain = 'https://vrindavanhotel.com') {
  let d = (rawDomain || process.env.NEXT_PUBLIC_SITE_URL || 'https://vrindavanhotel.com').trim();
  if (!d.startsWith('http://') && !d.startsWith('https://')) {
    d = `https://${d}`;
  }
  if (!d.includes('localhost') && d.startsWith('http://')) {
    d = d.replace('http://', 'https://');
  }
  d = d.replace('://www.', '://');
  return d.replace(/\/+$/, '');
}

/**
 * Builds a clean, self-referencing canonical URL with consistent trailing slash `/`
 * and strips any query/tracking parameters (utm_*, fbclid, gclid, etc.).
 */
export function buildCanonicalUrl(domain, pathOrSlug = '', overrideUrl = '', isOverride = false) {
  const base = normalizeDomain(domain);

  if (isOverride && overrideUrl && overrideUrl.trim() !== '') {
    try {
      const parsed = new URL(overrideUrl.trim(), base);
      parsed.search = '';
      parsed.hash = '';
      let cleanPath = parsed.pathname.replace(/\/+/g, '/');
      if (!cleanPath.endsWith('/')) cleanPath += '/';
      return `${parsed.origin.replace('://www.', '://')}${cleanPath}`;
    } catch {
      // Fallback to standard generation if invalid URL
    }
  }

  let cleanSlug = String(pathOrSlug || '')
    .split('?')[0]
    .split('#')[0]
    .trim()
    .replace(/^\/+|\/+$/g, '');

  if (!cleanSlug || cleanSlug === 'home') {
    return `${base}/`;
  }

  return `${base}/${cleanSlug}/`;
}

/**
 * Generates Next.js Metadata object with smart defaults if any SEO field is left blank.
 */
export function generateNextMetadata({
  settings,
  title,
  seoTitle,
  metaDescription,
  excerpt,
  slugPath = '',
  canonicalUrl = '',
  canonicalOverride = false,
  featuredImage = '',
  ogTitle = '',
  ogDescription = '',
  ogImage = '',
  isIndexed = true,
  type = 'website',
}) {
  const domain = normalizeDomain(settings?.domain);
  const hotelName = settings?.hotelName || '[naam]';

  const finalTitle =
    (seoTitle && seoTitle.trim()) ||
    (title ? `${title} | ${hotelName}` : settings?.defaultMetaTitle || `${hotelName} - Vrindavan`);

  const finalDescription =
    (metaDescription && metaDescription.trim()) ||
    (excerpt && excerpt.trim()) ||
    settings?.defaultMetaDescription ||
    `Book direct at ${hotelName} near Banke Bihari Temple, Vrindavan and save 10%.`;

  const finalCanonical = buildCanonicalUrl(domain, slugPath, canonicalUrl, canonicalOverride);

  const finalOgImage =
    (ogImage && ogImage.trim()) ||
    (featuredImage && featuredImage.trim()) ||
    settings?.defaultOgImage ||
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80';

  return {
    title: finalTitle,
    description: finalDescription,
    alternates: {
      canonical: finalCanonical,
      languages: {
        'en-IN': finalCanonical,
        'x-default': finalCanonical,
      },
    },
    robots: isIndexed
      ? {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        }
      : {
          index: false,
          follow: false,
        },
    openGraph: {
      title: (ogTitle && ogTitle.trim()) || finalTitle,
      description: (ogDescription && ogDescription.trim()) || finalDescription,
      url: finalCanonical,
      siteName: hotelName,
      locale: 'en_IN',
      type: type === 'blog' ? 'article' : 'website',
      images: [
        {
          url: finalOgImage,
          width: 1200,
          height: 630,
          alt: title || hotelName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: (ogTitle && ogTitle.trim()) || finalTitle,
      description: (ogDescription && ogDescription.trim()) || finalDescription,
      images: [finalOgImage],
    },
    verification: settings?.searchConsoleCode
      ? { google: settings.searchConsoleCode }
      : undefined,
  };
}

/**
 * Generates JSON-LD Schema Graph for any page:
 * - Hotel + LocalBusiness (sitewide)
 * - FAQPage (if FAQs exist)
 * - BreadcrumbList (on inner pages)
 * - Article / BlogPosting (on blog posts)
 * - HotelRoom + Offer (on individual room pages)
 */
export function buildJsonLdSchemas({
  settings,
  pageType = 'page',
  slugPath = '',
  title = '',
  description = '',
  featuredImage = '',
  faqs = [],
  breadcrumbs = [],
  room = null,
  publishedAt = null,
  updatedAt = null,
  author = '',
}) {
  const domain = normalizeDomain(settings?.domain);
  const canonical = buildCanonicalUrl(domain, slugPath);
  const amenities = safeJsonParse(settings?.amenitiesList, []);
  const parsedFaqs = Array.isArray(faqs) ? faqs : safeJsonParse(faqs, []);

  const sameAs = [
    settings?.googleBusinessUrl,
    settings?.facebookUrl,
    settings?.instagramUrl,
    settings?.youtubeUrl,
  ].filter(Boolean);

  const schemas = [];

  // 1. Hotel + LocalBusiness Schema
  schemas.push({
    '@context': 'https://schema.org',
    '@type': ['Hotel', 'LocalBusiness'],
    '@id': `${domain}/#hotel`,
    name: settings?.hotelName || '[naam]',
    description: settings?.defaultMetaDescription || description,
    url: `${domain}/`,
    telephone: settings?.phone || '[number]',
    email: settings?.email || '[email]',
    priceRange: settings?.priceRange || 'Deluxe ₹__, Family ₹__, Suite ₹__',
    checkinTime: settings?.checkInTime || '[time]',
    checkoutTime: settings?.checkOutTime || '[time]',
    image: featuredImage || settings?.defaultOgImage,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings?.address || '[full address]',
      addressLocality: 'Vrindavan',
      addressRegion: 'Uttar Pradesh',
      postalCode: '281121',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: settings?.geoLatitude || '27.5806',
      longitude: settings?.geoLongitude || '77.6913',
    },
    amenityFeature: amenities.map((a) => ({
      '@type': 'LocationFeatureSpecification',
      name: a,
      value: true,
    })),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  });

  // 2. BreadcrumbList Schema on inner pages
  if (breadcrumbs && breadcrumbs.length > 1) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((b, idx) => ({
        '@type': 'ListItem',
        position: idx + 1,
        name: b.name,
        item: buildCanonicalUrl(domain, b.path),
      })),
    });
  }

  // 3. FAQPage Schema (auto-built from admin FAQs)
  const validFaqs = parsedFaqs.filter(
    (f) => f && f.question && f.question.trim() && f.answer && f.answer.trim()
  );
  if (validFaqs.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: validFaqs.map((f) => ({
        '@type': 'Question',
        name: f.question.trim(),
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.answer.trim(),
        },
      })),
    });
  }

  // 4. Article / BlogPosting Schema on blog posts
  if (pageType === 'blog') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: title,
      description,
      image: featuredImage ? [featuredImage] : [settings?.defaultOgImage],
      datePublished: publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString(),
      dateModified: updatedAt ? new Date(updatedAt).toISOString() : new Date().toISOString(),
      author: {
        '@type': 'Organization',
        name: author || settings?.hotelName || '[naam]',
      },
      publisher: {
        '@type': 'Organization',
        name: settings?.hotelName || '[naam]',
        url: `${domain}/`,
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': canonical,
      },
    });
  }

  // 5. Room + Offer Schema on individual room pages
  if (room) {
    const roomAmenities = safeJsonParse(room.amenities, []);
    const roomImages = safeJsonParse(room.images, []);
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'HotelRoom',
      name: room.name,
      description: room.shortDescription || description,
      url: canonical,
      bed: {
        '@type': 'BedDetails',
        typeOfBed: room.bedType,
      },
      occupancy: {
        '@type': 'QuantitativeValue',
        maxValue: room.capacity || 2,
      },
      image: roomImages.map((img) => img.url || img),
      amenityFeature: roomAmenities.map((a) => ({
        '@type': 'LocationFeatureSpecification',
        name: a,
        value: true,
      })),
      offers: {
        '@type': 'Offer',
        priceCurrency: 'INR',
        price: room.priceNumeric > 0 ? String(room.priceNumeric) : room.pricePlaceholder || '0',
        availability: 'https://schema.org/InStock',
        url: canonical,
      },
    });
  }

  return schemas;
}

/**
 * IndexNow automatic ping helper (notifies Bing, Yandex & IndexNow engines on publish/update)
 */
export async function pingIndexNow(domain, urlPaths = [], apiKey = 'vrindavan-hotel-indexnow-key-2026') {
  const base = normalizeDomain(domain);
  if (base.includes('localhost')) {
    return { pinged: false, reason: 'Skipped on localhost; active on live domain.' };
  }

  try {
    const host = new URL(base).host;
    const urlList = urlPaths.map((p) => buildCanonicalUrl(base, p));
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host,
        key: apiKey,
        urlList,
      }),
    });
    return { pinged: res.ok, status: res.status, urls: urlList };
  } catch (err) {
    return { pinged: false, reason: err.message };
  }
}
