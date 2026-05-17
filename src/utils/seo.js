import { useEffect } from 'react';

const SITE_NAME = 'Vishwakarma Build & Furnish CKD';
const BUSINESS_NAME = 'Vishwakarma Build & Furnish';
const DEFAULT_DESCRIPTION =
  'House construction, modular kitchen, wardrobe, doors, windows, plumbing, electrical, paint, tiles, marble and interior work in Charkhi Dadri, Haryana.';
const DEFAULT_IMAGE = '/favicon.svg';

const siteUrl = (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/+$/, '');

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
    const fullTitle = title?.includes(SITE_NAME) ? title : `${title || SITE_NAME} | ${SITE_NAME}`;
    const canonicalUrl = buildPageUrl(path);
    const imageUrl = normalizeImage(image);
    const cleanDescription = String(description || DEFAULT_DESCRIPTION).slice(0, 170);
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
    'Rohtak',
    'Kosli',
    'Mahendragarh',
    'Jhajjar',
    'Loharu',
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
