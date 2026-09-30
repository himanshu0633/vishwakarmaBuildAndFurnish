const fs = require('fs');
const path = require('path');

const SITE_URL = 'https://vishwakarmabuildandfurnish.in';
const BUSINESS_NAME = 'Vishwakarma Build & Furnish';
const DEFAULT_IMAGE = `${SITE_URL}/logo.png`;
const DEFAULT_DESCRIPTION =
  'Looking for the best construction contractor or interior designer in Charkhi Dadri? Vishwakarma Build & Furnish offers premium house construction, modular kitchens, wooden doors, and custom furniture.';

const distDir = path.resolve(__dirname, '../dist');
const indexPath = path.join(distDir, 'index.html');
const seedCatalogPath = path.resolve(__dirname, '../../vishwakarmaBuildAndFurnishBackend/scripts/seedCurrentCatalog.js');

if (!fs.existsSync(indexPath)) {
  throw new Error('dist/index.html not found. Run vite build before prerenderSeo.');
}

const baseHtml = fs.readFileSync(indexPath, 'utf8');
const seedCatalog = fs.readFileSync(seedCatalogPath, 'utf8');
const match = seedCatalog.match(/const services = (\[[\s\S]*?\]);\s*const/);

if (!match) {
  throw new Error('Unable to read services from seedCurrentCatalog.js');
}

const services = eval(match[1]);

const escapeHtml = (value = '') =>
  String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const slugify = (value = '') =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const trimText = (value = '', max = 300) => {
  const text = String(value || '').replace(/\s+/g, ' ').trim();
  if (text.length <= max) return text;
  const sliced = text.slice(0, max + 1);
  const lastSpace = sliced.lastIndexOf(' ');
  return `${sliced.slice(0, lastSpace > 40 ? lastSpace : max).trim()}...`;
};

const withBrand = (title) => {
  const cleanTitle = trimText(title || BUSINESS_NAME, 60);
  return cleanTitle.includes(BUSINESS_NAME) ? cleanTitle : trimText(`${cleanTitle} | ${BUSINESS_NAME}`, 60);
};

const getImageUrl = (raw = '') => {
  if (!raw) return DEFAULT_IMAGE;
  if (/^https?:\/\//i.test(raw)) return raw;
  return `${SITE_URL}${raw.startsWith('/') ? raw : `/${raw}`}`;
};

const getServiceDescription = (service) =>
  trimText(
    service.seoDescription ||
      service.shortDescription ||
      service.description ||
      `Premium ${service.name} service in Charkhi Dadri, Haryana by ${BUSINESS_NAME}. View latest designs, images, pricing guidance and request a free quote.`,
    300
  );

const getBlogTitle = (service) => {
  const rawName = service.name || 'Service';
  const name = rawName
    .replace(/\bcustomized\b/gi, 'Custom')
    .replace(/\bcustom\b/gi, 'Custom')
    .replace(/\bdesigns?\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
  const normalizedName = name.toLowerCase();

  if (normalizedName.includes('bed')) return `Custom ${name} Manufacturing in Charkhi Dadri`;
  if (normalizedName.includes('kitchen') || normalizedName.includes('wardrobe') || normalizedName.includes('tv')) {
    return `Latest ${name} Designs in Charkhi Dadri`;
  }
  if (
    normalizedName.includes('construction') ||
    normalizedName.includes('paint') ||
    normalizedName.includes('electrical') ||
    normalizedName.includes('plumbing')
  ) {
    return `Professional ${name} Services in Charkhi Dadri`;
  }
  return normalizedName.startsWith('custom ')
    ? `${name} Designs in Charkhi Dadri`
    : `Custom ${name} Designs in Charkhi Dadri`;
};

const getCategoryName = (categorySlug = '') => {
  const names = {
    'wooden-work-services': 'Wooden Work Services',
    'furniture-services': 'Furniture Services',
    'construction-services': 'Construction Services',
    'interior-services': 'Interior Services'
  };
  return names[categorySlug] || categorySlug.split('-').filter(Boolean).map((part) => part[0].toUpperCase() + part.slice(1)).join(' ');
};

const replaceOrInsert = (html, pattern, replacement, before = '</head>') => {
  if (pattern.test(html)) return html.replace(pattern, replacement);
  return html.replace(before, `    ${replacement}\n  ${before}`);
};

const buildHtml = ({ path: routePath, canonicalPath, title, description, image = DEFAULT_IMAGE, type = 'website', structuredData }) => {
  const canonical = `${SITE_URL}${canonicalPath || routePath}`;
  const safeTitle = escapeHtml(withBrand(title));
  const safeDescription = escapeHtml(trimText(description || DEFAULT_DESCRIPTION, 300));
  const safeImage = escapeHtml(image);
  const safeCanonical = escapeHtml(canonical);
  const jsonLd = JSON.stringify(
    structuredData || {
      '@context': 'https://schema.org',
      '@type': type === 'article' ? 'BlogPosting' : 'WebPage',
      name: withBrand(title),
      description: trimText(description || DEFAULT_DESCRIPTION, 300),
      url: canonical,
      image
    }
  );

  let html = baseHtml;
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${safeTitle}</title>`);
  html = replaceOrInsert(html, /<meta name="description" content="[^"]*"\s*\/?>/i, `<meta name="description" content="${safeDescription}" />`);
  html = replaceOrInsert(html, /<meta property="og:title" content="[^"]*"\s*\/?>/i, `<meta property="og:title" content="${safeTitle}" />`);
  html = replaceOrInsert(html, /<meta property="og:description" content="[^"]*"\s*\/?>/i, `<meta property="og:description" content="${safeDescription}" />`);
  html = replaceOrInsert(html, /<meta property="og:type" content="[^"]*"\s*\/?>/i, `<meta property="og:type" content="${type}" />`);
  html = replaceOrInsert(html, /<meta property="og:url" content="[^"]*"\s*\/?>/i, `<meta property="og:url" content="${safeCanonical}" />`);
  html = replaceOrInsert(html, /<meta property="og:image" content="[^"]*"\s*\/?>/i, `<meta property="og:image" content="${safeImage}" />`);
  html = replaceOrInsert(html, /<meta name="twitter:title" content="[^"]*"\s*\/?>/i, `<meta name="twitter:title" content="${safeTitle}" />`);
  html = replaceOrInsert(html, /<meta name="twitter:description" content="[^"]*"\s*\/?>/i, `<meta name="twitter:description" content="${safeDescription}" />`);
  html = replaceOrInsert(html, /<meta name="twitter:image" content="[^"]*"\s*\/?>/i, `<meta name="twitter:image" content="${safeImage}" />`);
  html = replaceOrInsert(html, /<meta name="twitter:url" content="[^"]*"\s*\/?>/i, `<meta name="twitter:url" content="${safeCanonical}" />`);
  html = replaceOrInsert(html, /<link rel="canonical" href="[^"]*"\s*\/?>/i, `<link rel="canonical" href="${safeCanonical}" />`);
  html = html.replace(
    /<script type="application\/ld\+json">[\s\S]*?<\/script>/i,
    `<script type="application/ld+json">${jsonLd.replace(/</g, '\\u003c')}</script>`
  );
  return html;
};

const writeRoute = (routePath, meta) => {
  const normalizedPath = routePath === '/' ? '' : routePath.replace(/^\/+|\/+$/g, '');
  const targetDir = path.join(distDir, normalizedPath);
  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(path.join(targetDir, 'index.html'), buildHtml({ path: routePath, ...meta }), 'utf8');
  generatedRoutes += 1;
};

let generatedRoutes = 0;

const staticRoutes = [
  ['/', { title: 'Vishwakarma Build & Furnish | Charkhi Dadri', description: DEFAULT_DESCRIPTION }],
  ['/services', { title: 'Construction, Interior & Furniture Services in Charkhi Dadri', description: 'Explore construction, interior, wooden work and custom furniture services by Vishwakarma Build & Furnish in Charkhi Dadri, Haryana.' }],
  ['/blogs', { title: 'Blogs | Vishwakarma Build & Furnish', description: 'Read design ideas, material guidance, service images and local construction tips from Vishwakarma Build & Furnish in Charkhi Dadri.' }],
  ['/gallery', { title: 'Work Gallery | Vishwakarma Build & Furnish', description: 'View construction, interior, furniture and wooden work photos by Vishwakarma Build & Furnish in Charkhi Dadri.' }],
  ['/about', { title: 'About Vishwakarma Build & Furnish', description: 'Learn about Vishwakarma Build & Furnish, a Charkhi Dadri based construction, interior and furniture service provider.' }],
  ['/house-construction-guide', { title: 'House Construction Guide in Haryana', description: 'Step-by-step house construction guidance, material tips and planning advice for Charkhi Dadri and Haryana homeowners.' }],
  ['/contact', { title: 'Contact Vishwakarma Build & Furnish', description: 'Contact Vishwakarma Build & Furnish for construction, interior, furniture and wooden work services in Charkhi Dadri, Haryana.' }]
];

for (const [routePath, meta] of staticRoutes) {
  writeRoute(routePath, meta);
}

for (const categorySlug of ['wooden-work-services', 'construction-services', 'interior-services']) {
  const categoryName = getCategoryName(categorySlug);
  writeRoute(`/services/${categorySlug}`, {
    title: `${categoryName} in Charkhi Dadri`,
    description: `Explore ${categoryName.toLowerCase()} by ${BUSINESS_NAME} in Charkhi Dadri, Haryana.`
  });
}

for (const area of ['charkhi-dadri', 'bhiwani', 'rohtak', 'mahendragarh', 'rewari', 'jhajjar']) {
  const areaName = getCategoryName(area);
  writeRoute(`/locations/${area}`, {
    title: `${BUSINESS_NAME} Services in ${areaName}`,
    description: `Construction, interior and furniture services by ${BUSINESS_NAME} for ${areaName} and nearby Haryana areas.`
  });
}

for (const service of services) {
  const image = getImageUrl(service.heroImage || service.images?.[0]);
  const categorySlug = service.categorySlug || 'wooden-work-services';
  const servicePath = `/services/${categorySlug}/${service.slug}`;
  const legacyFurniturePath = `/services/furniture-services/${service.slug}`;
  const description = getServiceDescription(service);

  const serviceMeta = {
    title: service.seoTitle || `${service.name} in Charkhi Dadri`,
    description,
    image,
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: service.name,
      description,
      image,
      provider: { '@type': 'LocalBusiness', name: BUSINESS_NAME, url: SITE_URL },
      areaServed: 'Charkhi Dadri, Haryana',
      url: `${SITE_URL}${servicePath}`
    }
  };

  writeRoute(servicePath, serviceMeta);

  if (categorySlug === 'wooden-work-services') {
    writeRoute(legacyFurniturePath, {
      ...serviceMeta,
      canonicalPath: servicePath
    });
  }

  // Pre-render flat legacy service path pointing directly to canonical servicePath
  writeRoute(`/services/${service.slug}`, {
    ...serviceMeta,
    canonicalPath: servicePath
  });

  const blogTitle = getBlogTitle(service);
  const blogPath = `/blogs/${slugify(blogTitle)}`;
  const blogDescription = trimText(
    `Read ${blogTitle.toLowerCase()} by ${BUSINESS_NAME}. See images, material guidance, design ideas, price factors and local service details for Charkhi Dadri, Haryana.`,
    300
  );

  writeRoute(blogPath, {
    title: blogTitle,
    description: blogDescription,
    image,
    type: 'article',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: blogTitle,
      description: blogDescription,
      image,
      author: { '@type': 'Organization', name: BUSINESS_NAME },
      publisher: { '@type': 'Organization', name: BUSINESS_NAME, logo: { '@type': 'ImageObject', url: DEFAULT_IMAGE } },
      mainEntityOfPage: `${SITE_URL}${blogPath}`,
      url: `${SITE_URL}${blogPath}`
    }
  });
}

console.log(`SEO prerender complete for ${generatedRoutes} routes.`);
