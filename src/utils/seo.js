import { useEffect } from 'react';

const SITE_NAME = 'Vishwakarma Build & Furnish ';
const BUSINESS_NAME = 'Vishwakarma Build & Furnish';
const DEFAULT_SITE_URL = 'https://vishwakarmabuildandfurnish.in';
const DEFAULT_DESCRIPTION =
  'Looking for the best construction contractor or interior designer in Charkhi Dadri? Vishwakarma Build & Furnish offers premium house construction, modular kitchens, wooden doors, and custom furniture at affordable prices. Get a free consultation today!';
const DEFAULT_IMAGE = '/favicon.svg';
const MAX_TITLE_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 300;

const siteUrl = (import.meta.env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, '');

const trimToLength = (value, maxLength) => {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  if (text.length <= maxLength) return text;

  const trimmed = text.slice(0, maxLength + 1);
  const lastSpace = trimmed.lastIndexOf(' ');
  return `${trimmed.slice(0, lastSpace > 40 ? lastSpace : maxLength).trim()}...`;
};

const formatTitle = (title) => {
  const cleanTitle = String(title || SITE_NAME).replace(/\s+/g, ' ').trim();
  const includesBrand = cleanTitle.includes(BUSINESS_NAME) || cleanTitle.includes(SITE_NAME);
  const titleWithBrand = includesBrand ? cleanTitle : `${cleanTitle} | ${BUSINESS_NAME}`;

  return trimToLength(titleWithBrand.length <= MAX_TITLE_LENGTH ? titleWithBrand : cleanTitle, MAX_TITLE_LENGTH);
};

const ensureMeta = (selector, createAttributes) => {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement('meta');
    Object.entries(createAttributes).forEach(([key, value]) => element.setAttribute(key, value));
    document.head.appendChild(element);
  }

  return element;
};

const setMeta = (name, content) => {
  if (!content) return;
  const element = ensureMeta(`meta[name="${name}"]`, { name });
  element.setAttribute('content', content);
};

const setProperty = (property, content) => {
  if (!content) return;
  const element = ensureMeta(`meta[property="${property}"]`, { property });
  element.setAttribute('content', content);
};

const setCanonical = (url) => {
  let element = document.head.querySelector('link[rel="canonical"]');

  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }

  element.setAttribute('href', url);
};

const normalizeImage = (image) => {
  if (!image) return `${siteUrl}${DEFAULT_IMAGE}`;
  if (/^https?:\/\//i.test(image)) return image;
  return `${siteUrl}${image.startsWith('/') ? image : `/${image}`}`;
};

export const buildPageUrl = (path = window.location.pathname) => `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;

export const useSeo = ({
  title,
  description = DEFAULT_DESCRIPTION,
  path,
  image,
  type = 'website',
  keywords = [],
  structuredData
}) => {
  useEffect(() => {
    const fullTitle = formatTitle(title);
    const canonicalUrl = buildPageUrl(path);
    const imageUrl = normalizeImage(image);
    const cleanDescription = trimToLength(description || DEFAULT_DESCRIPTION, MAX_DESCRIPTION_LENGTH);
    const cleanKeywords = Array.isArray(keywords) ? keywords.filter(Boolean).join(', ') : keywords;

    document.title = fullTitle;
    setMeta('description', cleanDescription);
    setMeta('keywords', cleanKeywords);
    setMeta('robots', 'index, follow, max-image-preview:large');
    setCanonical(canonicalUrl);

    setProperty('og:site_name', SITE_NAME);
    setProperty('og:title', fullTitle);
    setProperty('og:description', cleanDescription);
    setProperty('og:type', type);
    setProperty('og:url', canonicalUrl);
    setProperty('og:image', imageUrl);

    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', cleanDescription);
    setMeta('twitter:image', imageUrl);

    const scriptId = 'page-json-ld';
    let script = document.getElementById(scriptId);

    if (structuredData) {
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }

      script.textContent = JSON.stringify(structuredData);
    } else if (script) {
      script.remove();
    }
  }, [title, description, path, image, type, keywords, structuredData]);
};

export const businessStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'HomeAndConstructionBusiness',
  '@id': `${siteUrl}/#localbusiness`,
  name: BUSINESS_NAME,
  alternateName: SITE_NAME,
  description: DEFAULT_DESCRIPTION,
  image: `${siteUrl}/favicon.svg`,
  logo: `${siteUrl}/favicon.svg`,
  priceRange: '₹₹',
  areaServed: [
    'Charkhi Dadri',
    'Bhiwani',
    'Mahendragarh',
    'Rewari',
    'Rohtak',
    'Jhajjar',
    'Nearby villages',
    'Haryana'
  ],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Charkhi Dadri',
    addressRegion: 'Haryana',
    addressCountry: 'IN'
  },
  telephone: '+91-9416856468',
  url: siteUrl,
  hasMap: 'https://maps.app.goo.gl/V9mPoFxvSJm3hCM69',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '100',
    bestRating: '5'
  },
  review: [
    {
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: 'Rohit Sharma'
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '5',
        bestRating: '5'
      },
      reviewBody: 'Professional team and excellent finishing work for modular kitchen and furniture.'
    },
    {
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: 'Aman Jangra'
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '5',
        bestRating: '5'
      },
      reviewBody: 'Honest pricing, timely delivery, and reliable construction work in Charkhi Dadri.'
    }
  ],
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '09:00',
      closes: '19:00'
    }
  ],
  serviceType: [
    'House Construction',
    'Interior Design',
    'Modular Kitchen',
    'Wardrobe',
    'Doors and Windows',
    'Tiles and Marble Work',
    'Plumbing',
    'Electrical Work',
    'Paint Work',
    'Home Renovation'
  ]
};

export const buildServiceSeo = (serviceName = 'Construction Service') => {
  const cleanName = String(serviceName || 'Construction Service').replace(/\s+/g, ' ').trim();

  return {
    title: `${cleanName} in Charkhi Dadri | Vishwakarma Build & Furnish`,
    description: `${cleanName} service in Charkhi Dadri, Haryana by Vishwakarma Build & Furnish. Contact for custom design, quality material, quotation, installation and finishing work.`,
    keywords: [
      `${cleanName} Charkhi Dadri`,
      `${cleanName} Haryana`,
      `best ${cleanName} in Charkhi Dadri`,
      `${cleanName} design`,
      `${cleanName} price`,
      'Vishwakarma Build & Furnish'
    ]
  };
};

export const getImageAlt = (name = '', defaultFallback = '') => {
  const lower = String(name || '').toLowerCase();
  if (lower.includes('center table')) {
    return 'Modern wooden center table design Charkhi Dadri';
  }
  if (lower.includes('jali door') || lower.includes('jali single-double')) {
    return 'Customized wooden jali door work in Haryana';
  }
  if (lower.includes('modular kitchen') || lower.includes('kitchen layout') || lower.includes('kitchen interior')) {
    return 'L-shape modular kitchen installation by Vishwakarma Build and Furnish';
  }
  return defaultFallback || `${name} work by Vishwakarma Build & Furnish in Charkhi Dadri Haryana`;
};
