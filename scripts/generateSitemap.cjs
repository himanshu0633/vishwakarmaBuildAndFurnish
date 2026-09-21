const fs = require('fs');
const path = require('path');

const seedCatalogPath = path.resolve(__dirname, '../../vishwakarmaBuildAndFurnishBackend/scripts/seedCurrentCatalog.js');
const seedCatalog = fs.readFileSync(seedCatalogPath, 'utf8');
const match = seedCatalog.match(/const services = (\[[\s\S]*?\]);\s*const/);
const services = eval(match[1]);

const slugify = (value = '') =>
  value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const lower = (value = '') => String(value || '').toLowerCase().trim();

const getBlogTitle = (service) => {
  const rawName = service.name || 'Service';
  const name = rawName
    .replace(/\bcustomized\b/gi, 'Custom')
    .replace(/\bcustom\b/gi, 'Custom')
    .replace(/\bdesigns?\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
  const normalizedName = lower(name);

  if (normalizedName.includes('bed')) {
    return `Custom ${name} Manufacturing in Charkhi Dadri`;
  }
  if (normalizedName.includes('kitchen') || normalizedName.includes('wardrobe') || normalizedName.includes('tv')) {
    return `Latest ${name} Designs in Charkhi Dadri`;
  }
  if (normalizedName.includes('construction') || normalizedName.includes('paint') || normalizedName.includes('electrical') || normalizedName.includes('plumbing')) {
    return `Professional ${name} Services in Charkhi Dadri`;
  }
  return normalizedName.startsWith('custom ')
    ? `${name} Designs in Charkhi Dadri`
    : `Custom ${name} Designs in Charkhi Dadri`;
};

const escapeXml = (unsafe = '') =>
  String(unsafe || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const getImageUrl = (raw = '') => {
  if (!raw) return '';
  if (raw.startsWith('http')) return raw;
  return 'https://vishwakarmabuildandfurnish.in' + (raw.startsWith('/') ? '' : '/') + raw;
};

const now = new Date().toISOString();

let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;

// 1. Static pages
const staticPages = [
  { loc: 'https://vishwakarmabuildandfurnish.in/', priority: '1.0', changefreq: 'daily' },
  { loc: 'https://vishwakarmabuildandfurnish.in/services', priority: '0.9', changefreq: 'weekly' },
  { loc: 'https://vishwakarmabuildandfurnish.in/blogs', priority: '0.8', changefreq: 'weekly' },
  { loc: 'https://vishwakarmabuildandfurnish.in/gallery', priority: '0.8', changefreq: 'weekly' },
  { loc: 'https://vishwakarmabuildandfurnish.in/about', priority: '0.8', changefreq: 'weekly' },
  { loc: 'https://vishwakarmabuildandfurnish.in/house-construction-guide', priority: '0.8', changefreq: 'weekly' },
  { loc: 'https://vishwakarmabuildandfurnish.in/contact', priority: '0.8', changefreq: 'weekly' }
];

for (const p of staticPages) {
  xml += `  <url>\n    <loc>${p.loc}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>\n`;
}

// 2. Locations
const locations = ['charkhi-dadri', 'bhiwani', 'rohtak', 'mahendragarh', 'rewari', 'jhajjar'];
for (const loc of locations) {
  xml += `  <url>\n    <loc>https://vishwakarmabuildandfurnish.in/locations/${loc}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${loc === 'charkhi-dadri' ? '0.85' : '0.75'}</priority>\n  </url>\n`;
}

// 3. Categories
const categories = ['wooden-work-services', 'construction-services', 'interior-services'];
for (const cat of categories) {
  xml += `  <url>\n    <loc>https://vishwakarmabuildandfurnish.in/services/${cat}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.85</priority>\n  </url>\n`;
}

// 4. Services (all 39 active services)
for (const s of services) {
  const url = `https://vishwakarmabuildandfurnish.in/services/${s.categorySlug}/${s.slug}`;
  const firstImage = s.heroImage || (s.images && s.images[0]) || '';
  const img = getImageUrl(firstImage);
  xml += `  <url>\n    <loc>${url}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n`;
  if (img) {
    xml += `    <image:image>\n      <image:loc>${escapeXml(img)}</image:loc>\n      <image:title>${escapeXml(s.name)}</image:title>\n      <image:caption>${escapeXml(s.name + ' images and design in Charkhi Dadri Haryana')}</image:caption>\n    </image:image>\n`;
  }
  xml += `  </url>\n`;
}

// 5. Blogs (all 39 active blogs)
for (const s of services) {
  const blogTitle = getBlogTitle(s);
  const blogSlug = slugify(blogTitle);
  const url = `https://vishwakarmabuildandfurnish.in/blogs/${blogSlug}`;
  const firstImage = s.heroImage || (s.images && s.images[0]) || '';
  const img = getImageUrl(firstImage);
  xml += `  <url>\n    <loc>${url}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n`;
  if (img) {
    xml += `    <image:image>\n      <image:loc>${escapeXml(img)}</image:loc>\n      <image:title>${escapeXml(blogTitle)}</image:title>\n      <image:caption>${escapeXml(blogTitle + ' guide and design in Charkhi Dadri')}</image:caption>\n    </image:image>\n`;
  }
  xml += `  </url>\n`;
}

xml += `</urlset>\n`;

const targetPath = path.resolve(__dirname, '../public/sitemap.xml');
fs.writeFileSync(targetPath, xml, 'utf8');
console.log('Successfully wrote public/sitemap.xml with ' + (staticPages.length + locations.length + categories.length + services.length * 2) + ' total URLs.');
