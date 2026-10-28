import type { APIRoute } from 'astro';
import { absolute } from '../lib/locale';

// Concept sites under /sites/exemplos/ are noindex and stay out on purpose.
const pages = [
  { path: '/', alternates: { en: '/', 'pt-BR': '/pt/' } },
  { path: '/pt/', alternates: { en: '/', 'pt-BR': '/pt/' } },
  { path: '/sites/' },
];

export const GET: APIRoute = () => {
  const lastmod = new Date().toISOString().slice(0, 10);
  const urls = pages.map(({ path, alternates }) => {
    const links = alternates
      ? Object.entries(alternates).map(([lang, href]) => `\n    <xhtml:link rel="alternate" hreflang="${lang}" href="${absolute(href)}" />`).join('')
      : '';
    return `  <url>\n    <loc>${absolute(path)}</loc>\n    <lastmod>${lastmod}</lastmod>${links}\n  </url>`;
  });
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
