import { mkdir, rm, readFile, writeFile, cp } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { minify as minifyHtml } from 'html-minifier-terser';
import { minify as minifyJs } from 'terser';
import { transform as transformCss } from 'lightningcss';

import { site } from '../src/data/site.mjs';
import { publishedApartments } from '../src/data/apartments.mjs';
import { images } from '../src/data/gallery.mjs';
import { routes } from '../src/i18n.mjs';
import {
  path as routePath, abs, homePage, bbPage, apartmentsPage, apartmentPage,
  areaPage, galleryPage, contactPage, legalPage,
} from '../src/templates.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'src');
const dist = path.join(root, 'dist');
const WIDTHS = [480, 800, 1200, 1600];

/* ---------- images ---------- */

async function buildImages() {
  const outDir = path.join(dist, 'images');
  await mkdir(outDir, { recursive: true });
  const cacheFile = path.join(root, '.image-manifest.json');
  const cache = existsSync(cacheFile) ? JSON.parse(await readFile(cacheFile, 'utf8')) : {};
  const manifest = {};

  for (const [key, img] of Object.entries(images)) {
    const file = path.join(src, 'images', img.file);
    const meta = await sharp(file).metadata();
    const height = meta.height - (img.trimBottom || 0);
    const base = sharp(file).extract({ left: 0, top: 0, width: meta.width, height });
    const widths = WIDTHS.filter((w) => w <= meta.width);
    if (!widths.includes(meta.width) && meta.width < 1200) widths.push(meta.width);
    manifest[key] = { width: meta.width, height, widths };

    const sig = `${meta.width}x${height}-${widths.join(',')}`;
    const cached = cache[key] === sig && widths.every((w) => existsSync(path.join(outDir, `${key}-${w}.webp`)) && existsSync(path.join(outDir, `${key}-${w}.jpg`)));
    if (cached) continue;
    await Promise.all(widths.flatMap((w) => [
      base.clone().resize({ width: w }).webp({ quality: 78 }).toFile(path.join(outDir, `${key}-${w}.webp`)),
      base.clone().resize({ width: w }).jpeg({ quality: 80, mozjpeg: true, progressive: true }).toFile(path.join(outDir, `${key}-${w}.jpg`)),
    ]));
    cache[key] = sig;
  }

  // Logo: trimmed square, small sizes for the header + favicons.
  const logo = sharp(path.join(src, 'images', 'logo.png')).trim();
  await Promise.all([
    logo.clone().resize({ width: 160 }).webp({ quality: 85 }).toFile(path.join(outDir, 'logo-160.webp')),
    logo.clone().resize({ width: 320 }).webp({ quality: 85 }).toFile(path.join(outDir, 'logo-320.webp')),
    logo.clone().resize({ width: 512, height: 512, fit: 'contain', background: '#f5f3ed' }).png().toFile(path.join(outDir, 'logo-512.png')),
    logo.clone().resize({ width: 180, height: 180, fit: 'contain', background: '#f5f3ed' }).png().toFile(path.join(dist, 'apple-touch-icon.png')),
    logo.clone().resize({ width: 48, height: 48, fit: 'contain', background: '#f5f3ed' }).png().toFile(path.join(dist, 'favicon.png')),
  ]);
  const logoMeta = await sharp(path.join(outDir, 'logo-160.webp')).metadata();
  manifest.logo = { width: logoMeta.width, height: logoMeta.height };
  await writeFile(cacheFile, JSON.stringify(cache, null, 2));
  return manifest;
}

/* ---------- assets ---------- */

async function buildAssets() {
  const out = path.join(dist, 'assets');
  await mkdir(out, { recursive: true });
  const css = await readFile(path.join(src, 'css', 'styles.css'));
  const { code } = transformCss({ filename: 'styles.css', code: css, minify: true });
  await writeFile(path.join(out, 'styles.css'), code);
  const js = await readFile(path.join(src, 'js', 'main.js'), 'utf8');
  const min = await minifyJs(js, { compress: true, mangle: true });
  await writeFile(path.join(out, 'main.js'), min.code);
}

/* ---------- pages ---------- */

const htmlOpts = { collapseWhitespace: true, conservativeCollapse: true, removeComments: true, minifyCSS: true, minifyJS: true, keepClosingSlash: false, removeAttributeQuotes: false };

// Sub-path hosting (e.g. GitHub Pages at https://user.github.io/repo): every
// root-relative URL in the HTML gets the pathname of SITE_URL prepended.
const base = new URL(site.url).pathname.replace(/\/$/, '');
function rebase(html) {
  if (!base) return html;
  return html
    .replace(/((?:href|src|action|content)=")\/(?!\/)/g, `$1${base}/`)
    .replace(/(srcset=")([^"]*)/g, (_, a, list) => a + list.replace(/(^|,\s*)\/(?!\/)/g, `$1${base}/`));
}

async function writePage(urlPath, html, logoManifest) {
  const withLogo = rebase(html).replace('width="160" height="157"', `width="${logoManifest.width}" height="${logoManifest.height}"`);
  const dir = path.join(dist, urlPath);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, 'index.html'), await minifyHtml(withLogo, htmlOpts));
}

function collectPages(manifest) {
  const pages = [];
  for (const lang of site.langs) {
    pages.push({ url: routePath(lang, 'home'), html: homePage(manifest, lang), index: true, priority: '1.0' });
    pages.push({ url: routePath(lang, 'bb'), html: bbPage(manifest, lang), index: true, priority: '0.8' });
    pages.push({ url: routePath(lang, 'apartments'), html: apartmentsPage(manifest, lang), index: true, priority: '0.9' });
    for (const apt of publishedApartments) {
      pages.push({ url: routePath(lang, 'apartments', apt.slug), html: apartmentPage(manifest, lang, apt), index: true, priority: '0.9' });
    }
    pages.push({ url: routePath(lang, 'area'), html: areaPage(manifest, lang), index: true, priority: '0.7' });
    pages.push({ url: routePath(lang, 'gallery'), html: galleryPage(manifest, lang), index: true, priority: '0.6' });
    pages.push({ url: routePath(lang, 'contact'), html: contactPage(manifest, lang), index: true, priority: '0.9' });
    pages.push({ url: routePath(lang, 'privacy'), html: legalPage(manifest, lang, 'privacy'), index: false });
    pages.push({ url: routePath(lang, 'cookies'), html: legalPage(manifest, lang, 'cookies'), index: false });
  }
  return pages;
}

function rootRedirect() {
  const def = `/${site.defaultLang}/`;
  const langs = JSON.stringify(site.langs);
  return `<!doctype html><html lang="${site.defaultLang}"><head><meta charset="utf-8"><title>Verdi Colline | B&B Serra de’ Conti</title><meta name="robots" content="noindex"><link rel="canonical" href="${abs(def)}"><meta http-equiv="refresh" content="0; url=${base}${def}"><script>(function(){var l=${langs},p=(navigator.language||'').slice(0,2).toLowerCase();location.replace('${base}/'+(l.indexOf(p)>-1?p:'${site.defaultLang}')+'/'+location.search+location.hash)})()</script></head><body><a href="${base}${def}">Verdi Colline</a></body></html>`;
}

function sitemap(pages) {
  const alt = (url) => {
    const [, lang, ...rest] = url.split('/');
    const tail = rest.join('/');
    const key = Object.entries(routes[lang]).find(([, seg]) => tail === (seg ? `${seg}/` : '') || (seg && tail.startsWith(`${seg}/`)))?.[0];
    const slug = key === 'apartments' && tail !== `${routes[lang].apartments}/` ? tail.split('/')[1] : undefined;
    return site.langs.map((l) => `    <xhtml:link rel="alternate" hreflang="${l === 'it' ? 'it-IT' : l}" href="${abs(routePath(l, key, slug))}"/>`).join('\n')
      + `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(routePath(site.defaultLang, key, slug))}"/>`;
  };
  const today = new Date().toISOString().slice(0, 10);
  const entries = pages.filter((p) => p.index).map((p) =>
    `  <url>\n    <loc>${abs(p.url)}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${p.priority}</priority>\n${alt(p.url)}\n  </url>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries}\n</urlset>\n`;
}

const robots = () => `User-agent: *\nAllow: /\n\nSitemap: ${abs('/sitemap.xml')}\n`;

/* ---------- run ---------- */

const keepImages = process.argv.includes('--keep-images');
if (!keepImages) await rm(dist, { recursive: true, force: true });
else for (const d of ['assets', 'it', 'en']) await rm(path.join(dist, d), { recursive: true, force: true });
await mkdir(dist, { recursive: true });

const manifest = await buildImages();
await buildAssets();
const pages = collectPages(manifest);
for (const p of pages) await writePage(p.url, p.html, manifest.logo);
await writeFile(path.join(dist, 'index.html'), rootRedirect());
await writeFile(path.join(dist, 'sitemap.xml'), sitemap(pages));
await writeFile(path.join(dist, 'robots.txt'), robots());
await writeFile(path.join(dist, '.nojekyll'), '');
if (existsSync(path.join(root, 'public'))) await cp(path.join(root, 'public'), dist, { recursive: true });

console.log(`Built ${pages.length} pages → ${path.relative(root, dist)}/ (site url: ${site.url})`);
