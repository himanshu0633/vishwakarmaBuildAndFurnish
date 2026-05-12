import { useEffect } from 'react';

const SITE_NAME = 'Vishwakarma Build & Furnish CKD';
const DEFAULT_DESCRIPTION =
  'Premium furniture, wooden doors, windows, modular kitchen, interior and construction work in Charkhi Dadri, Haryana.';
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
  name: SITE_NAME,
  areaServed: ['Charkhi Dadri', 'Haryana'],
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Charkhi Dadri',
    addressRegion: 'Haryana',
    addressCountry: 'IN'
  },
  telephone: '+91-9416856468',
  url: siteUrl
};
