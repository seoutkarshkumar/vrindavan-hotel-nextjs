import { Router } from 'express';
import { readJSON } from '../lib/store.js';
import { DEFAULT_SETTINGS, DEFAULT_ROOMS, DEFAULT_BLOG, DEFAULT_PAGES } from '../lib/defaults.js';

const router = Router();

router.get('/robots.txt', (req, res) => {
  const url = process.env.SITE_URL || `http://localhost:${process.env.PORT || 3000}`;
  res.type('text/plain').send(
    `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /api\n\nSitemap: ${url}/sitemap.xml\n`
  );
});

router.get('/sitemap.xml', (req, res) => {
  const url = (process.env.SITE_URL || `http://localhost:${process.env.PORT || 3000}`).replace(/\/$/, '');
  const rooms = readJSON('rooms.json', DEFAULT_ROOMS);
  const blog = readJSON('blog.json', DEFAULT_BLOG);
  const pages = readJSON('pages.json', DEFAULT_PAGES).filter(p => p.published !== false);

  const staticUrls = ['', '/rooms', '/services', '/gallery', '/blog', '/about', '/contact', '/book'];
  const now = new Date().toISOString();

  const items = [
    ...staticUrls.map(p => ({ loc: `${url}${p}`, priority: p === '' ? '1.0' : '0.8' })),
    ...rooms.map(r => ({ loc: `${url}/rooms/${r.slug}`, priority: '0.7' })),
    ...blog.map(b  => ({ loc: `${url}/blog/${b.slug}`,  priority: '0.6' })),
    ...pages.map(p => ({ loc: `${url}/pages/${p.slug}`, priority: '0.5' })),
  ];

  const xml =
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items.map(i => `  <url><loc>${i.loc}</loc><lastmod>${now}</lastmod><priority>${i.priority}</priority></url>`).join('\n')}
</urlset>`;

  res.type('application/xml').send(xml);
});

router.get('/api/seo/settings', (req, res) => {
  res.json(readJSON('settings.json', DEFAULT_SETTINGS));
});

export default router;
