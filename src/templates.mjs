import { site, services } from './data/site.mjs';
import { publishedApartments } from './data/apartments.mjs';
import { destinations } from './data/destinations.mjs';
import { images, galleryOrder, heroImage } from './data/gallery.mjs';
import { routes, hreflang, t } from './i18n.mjs';
import { icons } from './icons.mjs';
import { legalContent } from './legal.mjs';

export const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const path = (lang, key, slug) => {
  const seg = routes[lang][key];
  let p = `/${lang}/`;
  if (seg) p += `${seg}/`;
  if (slug) p += `${slug}/`;
  return p;
};
export const abs = (p) => `${site.url}${p}`;

const mapsQuery = encodeURIComponent(`${site.address.street}, ${site.address.locality}, ${site.address.region}, Italy`);
export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

/* ---------- images ---------- */

export function picture(manifest, key, lang, opts = {}) {
  const m = manifest[key];
  const img = images[key];
  const alt = opts.alt ?? img.alt[lang];
  const sizes = opts.sizes || '100vw';
  const srcset = (ext) => m.widths.map((w) => `/images/${key}-${w}.${ext} ${w}w`).join(', ');
  const fallbackW = m.widths.includes(1200) ? 1200 : m.widths[m.widths.length - 1];
  const h = Math.round((m.height / m.width) * fallbackW);
  const attrs = [
    `src="/images/${key}-${fallbackW}.jpg"`,
    `srcset="${srcset('jpg')}"`,
    `sizes="${sizes}"`,
    `width="${fallbackW}"`,
    `height="${h}"`,
    `alt="${esc(alt)}"`,
    `loading="${opts.loading || 'lazy'}"`,
    `decoding="async"`,
    opts.fetchpriority ? `fetchpriority="${opts.fetchpriority}"` : '',
    opts.cls ? `class="${opts.cls}"` : '',
  ].filter(Boolean).join(' ');
  return `<picture><source type="image/webp" srcset="${srcset('webp')}" sizes="${sizes}"><img ${attrs}></picture>`;
}

/* ---------- shared blocks ---------- */

const ctaPhone = (lang, cls = 'btn btn-outline') =>
  `<a class="${cls}" href="${site.phoneHref}">${icons.phone}<span>${t[lang].contact.call}</span></a>`;
const ctaWhatsapp = (lang, cls = 'btn btn-primary') =>
  `<a class="${cls}" href="${site.whatsappHref}" target="_blank" rel="noopener">${icons.whatsapp}<span>${t[lang].contact.whatsapp}</span></a>`;

function bookingButtons(lang, apt) {
  const s = t[lang].apartments;
  const bookingUrl = apt?.bookingUrl ?? site.bookingUrl;
  const airbnbUrl = apt?.airbnbUrl ?? site.airbnbUrl;
  let html = '';
  if (bookingUrl) html += `<a class="btn btn-primary" href="${esc(bookingUrl)}" target="_blank" rel="noopener">${s.bookOn}</a>`;
  if (airbnbUrl) html += `<a class="btn btn-primary" href="${esc(airbnbUrl)}" target="_blank" rel="noopener">${s.bookAirbnb}</a>`;
  return html;
}

const sectionHead = (kicker, title, intro, tag = 'h2') =>
  `<div class="section-head"><p class="kicker">${kicker}</p><${tag}>${title}</${tag}>${intro ? `<p class="lead">${intro}</p>` : ''}</div>`;

function apartmentCard(manifest, lang, apt, headingTag = 'h3') {
  const s = t[lang].apartments;
  const href = path(lang, 'apartments', apt.slug);
  const feats = apt.features.slice(0, 4).map((f) => `<li>${icons[f.icon] || ''}<span>${f[lang]}</span></li>`).join('');
  const price = apt.price != null
    ? `<p class="price"><strong>€${apt.price}</strong> <span>${s.perNight}</span></p>`
    : '';
  return `<article class="card apt-card">
  <a class="card-media" href="${href}" tabindex="-1" aria-hidden="true">${picture(manifest, apt.image, lang, { alt: apt.imageAlt[lang], sizes: '(min-width: 900px) 45vw, 100vw' })}</a>
  <div class="card-body">
    <${headingTag} class="card-title"><a href="${href}">${apt.name[lang]}</a></${headingTag}>
    <p>${apt.short[lang]}</p>
    <ul class="feature-list">${feats}</ul>
    <div class="card-foot">${price}<a class="btn btn-ghost" href="${href}">${s.details}${icons.arrow}</a></div>
  </div>
</article>`;
}

function destinationCard(manifest, lang, d, headingTag = 'h3') {
  const media = d.image ? `<div class="card-media">${picture(manifest, d.image, lang, { sizes: '(min-width: 900px) 25vw, 100vw' })}</div>` : '';
  const dist = d.distance ? `<p class="distance">${d.distance[lang]}</p>` : '';
  return `<article class="card dest-card">${media}<div class="card-body"><${headingTag} class="card-title">${d.name[lang]}</${headingTag}><p>${d.text[lang]}</p>${dist}</div></article>`;
}

function servicesList(lang) {
  return `<ul class="services">${services.map((s) => `<li>${icons[s.icon]}<span>${s.label[lang]}</span></li>`).join('')}</ul>`;
}

function galleryGrid(manifest, lang, keys) {
  return `<div class="gallery" data-lightbox>${keys.map((k, i) => {
    const m = manifest[k];
    const big = m.widths[m.widths.length - 1];
    const orient = m.width / m.height > 1.9 ? ' wide' : m.width / m.height < 1 ? ' tall' : '';
    return `<a class="gallery-item${orient}" href="/images/${k}-${big}.jpg" data-index="${i}" data-alt="${esc(images[k].alt[lang])}">${picture(manifest, k, lang, { sizes: '(min-width: 900px) 33vw, (min-width: 600px) 50vw, 100vw' })}</a>`;
  }).join('')}</div>`;
}

function lightbox(lang) {
  const g = t[lang].gallery;
  return `<div class="lightbox" id="lightbox" hidden role="dialog" aria-modal="true" aria-label="${g.title}">
  <button class="lb-close" type="button" data-lb-close aria-label="${g.close}">${icons.close}</button>
  <button class="lb-prev" type="button" data-lb-prev aria-label="${g.prev}">${icons.chevronLeft}</button>
  <figure><img alt=""><figcaption></figcaption></figure>
  <button class="lb-next" type="button" data-lb-next aria-label="${g.next}">${icons.chevronRight}</button>
</div>`;
}

function contactBlock(lang, headingTag = 'h2') {
  const c = t[lang].contact;
  const a = site.address;
  return `<div class="contact-grid">
  <div>
    ${sectionHead(c.kicker, c.title, c.intro, headingTag)}
    <div class="btn-row">${ctaWhatsapp(lang)}${ctaPhone(lang)}</div>
    <dl class="contact-details">
      <div>${icons.phone}<dt>${c.phoneLabel}</dt><dd><a href="${site.phoneHref}">${site.phone}</a></dd></div>
      <div>${icons.pin}<dt>${c.addressLabel}</dt><dd><address>${a.street}<br>${a.locality}, ${a.region}, Italia</address><a href="${mapsUrl}" target="_blank" rel="noopener">${c.mapLink}</a></dd></div>
    </dl>
  </div>
  <form class="contact-form" data-whatsapp-form data-intro="${esc(c.form.whatsappIntro)}" data-wa="${site.whatsappHref}">
    <h3>${c.form.title}</h3>
    <label>${c.form.name}<input type="text" name="name" autocomplete="name" required></label>
    <label>${c.form.dates}<input type="text" name="dates" autocomplete="off"></label>
    <label>${c.form.guests}<input type="number" name="guests" min="1" max="20" inputmode="numeric"></label>
    <label>${c.form.message}<textarea name="message" rows="4" required></textarea></label>
    <button class="btn btn-primary" type="submit">${icons.whatsapp}<span>${c.form.send}</span></button>
    <p class="form-note">${c.form.note}</p>
  </form>
</div>`;
}

/* ---------- layout ---------- */

function header(lang, alternates, current) {
  const s = t[lang];
  const navItems = ['bb', 'apartments', 'area', 'gallery', 'contact'];
  const li = navItems.map((k) => `<li><a href="${path(lang, k)}"${current === k ? ' aria-current="page"' : ''}>${s.nav[k]}</a></li>`).join('');
  const langSwitch = `<nav class="lang" aria-label="${s.switchLang}">${site.langs.map((l) =>
    l === lang ? `<span aria-current="true" lang="${l}">${l.toUpperCase()}</span>` : `<a href="${alternates[l]}" hreflang="${hreflang[l]}" lang="${l}">${l.toUpperCase()}</a>`
  ).join('<span class="sep" aria-hidden="true">|</span>')}</nav>`;
  return `<header class="site-header" id="top">
  <div class="wrap header-inner">
    <a class="brand" href="${path(lang, 'home')}" aria-label="${site.name} – Home">
      <img src="/images/logo-160.webp" srcset="/images/logo-160.webp 160w, /images/logo-320.webp 320w" sizes="80px" width="160" height="157" alt="${site.name} B&B Serra de’ Conti">
      <span class="brand-text"><span class="brand-name">Verdi Colline</span><span class="brand-sub">${site.tagline[lang]}</span></span>
    </a>
    <nav class="main-nav" id="main-nav" aria-label="${s.menu}">
      <ul>${li}</ul>
      <div class="nav-extra">${langSwitch}<a class="btn btn-primary" href="${path(lang, 'contact')}">${s.book}</a></div>
    </nav>
    <div class="header-actions">
      ${langSwitch}
      <a class="btn btn-primary btn-sm header-cta" href="${path(lang, 'contact')}">${s.book}</a>
      <button class="menu-toggle" type="button" aria-controls="main-nav" aria-expanded="false" aria-label="${s.openMenu}" data-open="${s.openMenu}" data-close="${s.closeMenu}"><span></span><span></span><span></span></button>
    </div>
  </div>
</header>`;
}

function footer(lang, alternates) {
  const s = t[lang];
  const a = site.address;
  const navItems = ['home', 'bb', 'apartments', 'area', 'gallery', 'contact'];
  const social = Object.entries(site.social).filter(([, v]) => v).map(([k, v]) => `<a href="${esc(v)}" target="_blank" rel="noopener">${k}</a>`).join('');
  return `<footer class="site-footer">
  <div class="wrap footer-grid">
    <div class="footer-brand">
      <p class="footer-name">Verdi Colline</p>
      <p class="footer-sub">${site.tagline[lang]}</p>
      <address>${a.street}<br>${a.locality}, ${a.region}, Italia</address>
    </div>
    <div>
      <p class="footer-title">${s.footer.contacts}</p>
      <ul>
        <li><a href="${site.phoneHref}">${site.phone}</a></li>
        <li><a href="${site.whatsappHref}" target="_blank" rel="noopener">WhatsApp</a></li>
        ${social ? `<li class="social">${social}</li>` : ''}
      </ul>
    </div>
    <div>
      <p class="footer-title">${s.footer.nav}</p>
      <ul>${navItems.map((k) => `<li><a href="${path(lang, k)}">${s.nav[k]}</a></li>`).join('')}</ul>
    </div>
    <div>
      <p class="footer-title">${s.footer.legal}</p>
      <ul>
        <li><a href="${path(lang, 'privacy')}">${s.legal.privacy}</a></li>
        <li><a href="${path(lang, 'cookies')}">${s.legal.cookies}</a></li>
        <li>${site.langs.map((l) => l === lang ? `<span>${l.toUpperCase()}</span>` : `<a href="${alternates[l]}" hreflang="${hreflang[l]}" lang="${l}">${l.toUpperCase()}</a>`).join(' | ')}</li>
      </ul>
    </div>
  </div>
  <div class="wrap footer-bottom">
    <p>${s.footer.cin}: <span class="cin">${site.cin}</span></p>
    <p>© <span data-year>${new Date().getFullYear()}</span> Verdi Colline B&B · ${s.footer.rights}</p>
  </div>
</footer>`;
}

function cookieBanner(lang) {
  const c = t[lang].cookie;
  return `<div class="cookie" id="cookie-banner" hidden role="region" aria-label="${c.title}">
  <div class="cookie-inner">
    <p class="cookie-text">${c.text} <a href="${path(lang, 'cookies')}">${c.policy}</a></p>
    <div class="cookie-prefs" hidden>
      <label><input type="checkbox" checked disabled> ${c.necessary}</label>
      <label><input type="checkbox" name="analytics"> ${c.analytics} <small>${c.analyticsText}</small></label>
    </div>
    <div class="cookie-actions">
      <button type="button" class="btn btn-primary btn-sm" data-cookie="accept">${c.accept}</button>
      <button type="button" class="btn btn-outline btn-sm" data-cookie="reject">${c.reject}</button>
      <button type="button" class="btn btn-ghost btn-sm" data-cookie="manage">${c.manage}</button>
      <button type="button" class="btn btn-outline btn-sm" data-cookie="save" hidden>${c.save}</button>
    </div>
  </div>
</div>`;
}

export function layout({ lang, pageKey, slug, title, description, body, jsonLd, hasGallery, noindex, image }) {
  const s = t[lang];
  const alternates = Object.fromEntries(site.langs.map((l) => [l, path(l, pageKey, slug)]));
  const canonical = abs(alternates[lang]);
  const ogImage = abs(`/images/${image || heroImage}-1200.jpg`);
  const hreflangs = site.langs.map((l) => `<link rel="alternate" hreflang="${hreflang[l]}" href="${abs(alternates[l])}">`).join('\n  ')
    + `\n  <link rel="alternate" hreflang="x-default" href="${abs(alternates[site.defaultLang])}">`;
  return `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  ${noindex ? '<meta name="robots" content="noindex, follow">' : ''}
  <link rel="canonical" href="${canonical}">
  ${hreflangs}
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Verdi Colline B&B">
  <meta property="og:locale" content="${lang === 'it' ? 'it_IT' : 'en_GB'}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${ogImage}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="theme-color" content="#F5F3ED">
  <link rel="icon" href="/favicon.png" type="image/png">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Inter:wght@400;500;600&display=swap">
  <link rel="stylesheet" href="/assets/styles.css">
  ${jsonLd ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ''}
</head>
<body>
<a class="skip" href="#main">${s.skip}</a>
${header(lang, alternates, pageKey)}
<main id="main">
${body}
</main>
${footer(lang, alternates)}
${cookieBanner(lang)}
${hasGallery ? lightbox(lang) : ''}
<script src="/assets/main.js" defer></script>
</body>
</html>`;
}

/* ---------- JSON-LD ---------- */

const lodgingLd = (lang) => {
  const prices = publishedApartments.map((a) => a.price).filter((p) => p != null);
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'BedAndBreakfast',
    name: 'Verdi Colline',
    url: abs(path(lang, 'home')),
    image: abs(`/images/${heroImage}-1600.jpg`),
    telephone: site.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
    identifier: { '@type': 'PropertyValue', propertyID: 'CIN', value: site.cin },
    amenityFeature: services.map((s) => ({ '@type': 'LocationFeatureSpecification', name: s.label[lang], value: true })),
    petsAllowed: true,
    containsPlace: publishedApartments.map((a) => ({
      '@type': 'Apartment',
      name: a.name[lang],
      url: abs(path(lang, 'apartments', a.slug)),
      occupancy: { '@type': 'QuantitativeValue', maxValue: a.occupancy },
      numberOfBedrooms: a.bedrooms,
    })),
  };
  if (prices.length) {
    const min = Math.min(...prices), max = Math.max(...prices);
    ld.priceRange = min === max ? `€${min}` : `€${min} - €${max}`;
  }
  return ld;
};

const apartmentLd = (lang, a) => ({
  '@context': 'https://schema.org',
  '@type': 'Apartment',
  name: a.name[lang],
  description: a.description[lang],
  url: abs(path(lang, 'apartments', a.slug)),
  image: abs(`/images/${a.image}-1600.jpg`),
  occupancy: { '@type': 'QuantitativeValue', maxValue: a.occupancy },
  numberOfBedrooms: a.bedrooms,
  petsAllowed: a.petsAllowed,
  amenityFeature: a.features.map((f) => ({ '@type': 'LocationFeatureSpecification', name: f[lang], value: true })),
  containedInPlace: {
    '@type': 'BedAndBreakfast',
    name: 'Verdi Colline',
    url: abs(path(lang, 'home')),
    telephone: site.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
  },
});

/* ---------- pages ---------- */

export function homePage(manifest, lang) {
  const s = t[lang];
  const story = site.ownerStory ? `<section class="section wrap narrow"><h2>${s.about.ownerStoryTitle}</h2><p>${site.ownerStory[lang]}</p></section>` : '';
  const body = `
<section class="hero">
  ${picture(manifest, heroImage, lang, { loading: 'eager', fetchpriority: 'high', sizes: '100vw', cls: 'hero-img' })}
  <div class="hero-overlay"></div>
  <div class="hero-content wrap">
    <h1 class="hero-brand">Verdi Colline<span class="hero-sub">B&B · Serra de’ Conti</span></h1>
    <p class="hero-title">${s.hero.title}</p>
    <p class="hero-text">${s.hero.text}</p>
    <div class="btn-row">
      <a class="btn btn-primary" href="${path(lang, 'apartments')}">${s.discoverApartments}</a>
      <a class="btn btn-light" href="${path(lang, 'contact')}">${s.requestAvailability}</a>
    </div>
  </div>
</section>

<section class="section wrap about">
  <div class="about-grid">
    <div class="about-media">${picture(manifest, 'ingresso', lang, { sizes: '(min-width: 900px) 45vw, 100vw' })}</div>
    <div class="about-text">
      ${sectionHead(s.about.kicker, s.about.title, null)}
      <p class="lead">${s.about.text}</p>
      <a class="btn btn-ghost" href="${path(lang, 'bb')}">${s.about.more}${icons.arrow}</a>
    </div>
  </div>
</section>
${story}
<section class="section section-alt">
  <div class="wrap">
    ${sectionHead(s.apartments.kicker, s.apartments.title, s.apartments.intro)}
    <div class="grid grid-2">${publishedApartments.map((a) => apartmentCard(manifest, lang, a)).join('')}</div>
  </div>
</section>

<section class="section wrap">
  ${sectionHead(s.services.kicker, s.services.title, null)}
  ${servicesList(lang)}
</section>

<section class="section section-alt">
  <div class="wrap">
    ${sectionHead(s.area.kicker, s.area.title, s.area.intro)}
    <div class="grid grid-4">${destinations.map((d) => destinationCard(manifest, lang, d)).join('')}</div>
    <p class="center"><a class="btn btn-ghost" href="${path(lang, 'area')}">${s.area.all}${icons.arrow}</a></p>
  </div>
</section>

<section class="section wrap">
  ${sectionHead(s.gallery.kicker, s.gallery.title, null)}
  ${galleryGrid(manifest, lang, galleryOrder.slice(0, 3))}
  <p class="center"><a class="btn btn-ghost" href="${path(lang, 'gallery')}">${s.gallery.all}${icons.arrow}</a></p>
</section>

<section class="section section-alt" id="contatti">
  <div class="wrap">${contactBlock(lang)}</div>
</section>`;
  return layout({ lang, pageKey: 'home', title: s.meta.home.title, description: s.meta.home.description, body, jsonLd: lodgingLd(lang), hasGallery: true });
}

export function bbPage(manifest, lang) {
  const s = t[lang];
  const story = site.ownerStory ? `<section class="section wrap narrow"><h2>${s.about.ownerStoryTitle}</h2><p>${site.ownerStory[lang]}</p></section>` : '';
  const body = `
<section class="page-hero wrap">
  <p class="kicker">${s.about.kicker}</p>
  <h1>${s.about.title}</h1>
  <p class="lead">${s.about.text}</p>
</section>
<section class="wrap"><div class="media-wide">${picture(manifest, 'ingresso', lang, { loading: 'eager', fetchpriority: 'high', sizes: '(min-width: 1200px) 1100px, 100vw' })}</div></section>
${story}
<section class="section wrap">
  ${sectionHead(s.services.kicker, s.services.title, null)}
  ${servicesList(lang)}
</section>
<section class="section wrap">
  <div class="media-grid">${picture(manifest, 'giardino', lang, { sizes: '(min-width: 900px) 50vw, 100vw' })}${picture(manifest, 'ulivo', lang, { sizes: '(min-width: 900px) 50vw, 100vw' })}</div>
</section>
<section class="section section-alt">
  <div class="wrap">
    ${sectionHead(s.apartments.kicker, s.apartments.title, s.apartments.intro)}
    <div class="grid grid-2">${publishedApartments.map((a) => apartmentCard(manifest, lang, a)).join('')}</div>
  </div>
</section>
<section class="section wrap cta-band">
  <h2>${s.requestAvailability}</h2>
  <div class="btn-row center">${ctaWhatsapp(lang)}${ctaPhone(lang)}</div>
</section>`;
  return layout({ lang, pageKey: 'bb', title: s.meta.bb.title, description: s.meta.bb.description, body, image: 'ingresso' });
}

export function apartmentsPage(manifest, lang) {
  const s = t[lang];
  const body = `
<section class="page-hero wrap">
  <p class="kicker">${s.apartments.kicker}</p>
  <h1>${s.apartments.title}</h1>
  <p class="lead">${s.apartments.intro}</p>
</section>
<section class="section wrap">
  <div class="grid grid-2">${publishedApartments.map((a) => apartmentCard(manifest, lang, a, 'h2')).join('')}</div>
</section>
<section class="section wrap">
  ${sectionHead(s.services.kicker, s.services.title, null)}
  ${servicesList(lang)}
</section>
<section class="section section-alt">
  <div class="wrap">${contactBlock(lang)}</div>
</section>`;
  return layout({ lang, pageKey: 'apartments', title: s.meta.apartments.title, description: s.meta.apartments.description, body });
}

export function apartmentPage(manifest, lang, apt) {
  const s = t[lang];
  const meta = s.meta.apartment(apt);
  const others = publishedApartments.filter((a) => a.slug !== apt.slug);
  const included = [
    apt.breakfastIncluded && ['breakfast', s.apartments.breakfast],
    apt.wifi && ['wifi', s.apartments.wifi],
    apt.parking && ['parking', s.apartments.parking],
    apt.petsAllowed && ['pets', s.apartments.pets],
  ].filter(Boolean);
  const price = apt.price != null ? `<p class="price price-lg"><strong>€${apt.price}</strong> <span>${s.apartments.perNight}</span></p>` : '';
  const booking = bookingButtons(lang, apt);
  const body = `
<article>
<section class="page-hero wrap">
  <p class="kicker"><a href="${path(lang, 'apartments')}">${s.apartments.title}</a></p>
  <h1>${apt.name[lang]}</h1>
  <p class="lead">${apt.short[lang]}</p>
</section>
<section class="wrap"><div class="media-wide">${picture(manifest, apt.image, lang, { alt: apt.imageAlt[lang], loading: 'eager', fetchpriority: 'high', sizes: '(min-width: 1200px) 1100px, 100vw' })}</div></section>
<section class="section wrap apt-detail">
  <div class="apt-main">
    <p>${apt.description[lang]}</p>
    <h2>${s.apartments.featuresTitle}</h2>
    <ul class="feature-list feature-grid">${apt.features.map((f) => `<li>${icons[f.icon] || ''}<span>${f[lang]}</span></li>`).join('')}</ul>
    ${included.length ? `<h2>${s.apartments.includedTitle}</h2><ul class="feature-list feature-grid">${included.map(([i, l]) => `<li>${icons[i]}<span>${l}</span></li>`).join('')}</ul>` : ''}
  </div>
  <aside class="apt-aside">
    ${price}
    <h2 class="aside-title">${s.apartments.bookOrAsk}</h2>
    ${booking ? `<div class="btn-stack">${booking}</div>` : ''}
    <p class="small">${s.apartments.bookingNote}</p>
    <div class="btn-stack">${ctaWhatsapp(lang)}${ctaPhone(lang)}</div>
    <ul class="aside-links">
      <li><a href="${path(lang, 'contact')}">${s.apartments.contactLink}</a></li>
      <li><a href="${path(lang, 'area')}">${s.apartments.areaLink}</a></li>
    </ul>
  </aside>
</section>
</article>
${others.length ? `<section class="section section-alt"><div class="wrap">${sectionHead(s.apartments.kicker, s.apartments.otherTitle, null)}<div class="grid grid-2">${others.map((a) => apartmentCard(manifest, lang, a)).join('')}</div></div></section>` : ''}`;
  return layout({ lang, pageKey: 'apartments', slug: apt.slug, title: meta.title, description: meta.description, body, jsonLd: apartmentLd(lang, apt), image: apt.image });
}

export function areaPage(manifest, lang) {
  const s = t[lang];
  const body = `
<section class="page-hero wrap">
  <p class="kicker">${s.area.kicker}</p>
  <h1>${s.area.title}</h1>
  <p class="lead">${s.area.intro}</p>
</section>
<section class="wrap"><div class="media-wide">${picture(manifest, 'panorama', lang, { loading: 'eager', fetchpriority: 'high', sizes: '(min-width: 1200px) 1100px, 100vw' })}</div></section>
<section class="section wrap">
  <div class="grid grid-2">${destinations.map((d) => destinationCard(manifest, lang, d, 'h2')).join('')}</div>
</section>
<section class="section wrap cta-band">
  <h2>${s.requestAvailability}</h2>
  <div class="btn-row center">
    <a class="btn btn-primary" href="${path(lang, 'apartments')}">${s.area.apartmentsLink}</a>
    <a class="btn btn-outline" href="${path(lang, 'contact')}">${s.area.contactLink}</a>
  </div>
</section>`;
  return layout({ lang, pageKey: 'area', title: s.meta.area.title, description: s.meta.area.description, body, image: 'panorama' });
}

export function galleryPage(manifest, lang) {
  const s = t[lang];
  const body = `
<section class="page-hero wrap">
  <p class="kicker">${s.gallery.kicker}</p>
  <h1>${s.gallery.title}</h1>
  <p class="lead">${s.gallery.intro}</p>
</section>
<section class="section wrap">${galleryGrid(manifest, lang, galleryOrder)}</section>
<section class="section wrap cta-band">
  <h2>${s.requestAvailability}</h2>
  <div class="btn-row center">
    <a class="btn btn-primary" href="${path(lang, 'apartments')}">${s.area.apartmentsLink}</a>
    <a class="btn btn-outline" href="${path(lang, 'contact')}">${s.area.contactLink}</a>
  </div>
</section>`;
  return layout({ lang, pageKey: 'gallery', title: s.meta.gallery.title, description: s.meta.gallery.description, body, hasGallery: true });
}

export function contactPage(manifest, lang) {
  const s = t[lang];
  const c = s.contact;
  const map = site.mapEmbedUrl
    ? `<div class="map"><iframe src="${esc(site.mapEmbedUrl)}" title="${c.whereTitle}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe></div>`
    : '';
  const body = `
<section class="section wrap">${contactBlock(lang, 'h1')}</section>
<section class="section section-alt">
  <div class="wrap">
    <h2>${c.whereTitle}</h2>
    <p><address class="inline">${site.address.street}, ${site.address.locality}, ${site.address.region}, Italia</address> · <a href="${mapsUrl}" target="_blank" rel="noopener">${c.mapLink}</a></p>
    ${map}
    <p class="small">${s.footer.cin}: <span class="cin">${site.cin}</span></p>
  </div>
</section>`;
  return layout({ lang, pageKey: 'contact', title: s.meta.contact.title, description: s.meta.contact.description, body, jsonLd: lodgingLd(lang) });
}

export function legalPage(manifest, lang, which) {
  const s = t[lang];
  const content = legalContent[which][lang];
  const body = `
<article class="section wrap narrow legal">
  <h1>${content.title}</h1>
  <p class="small">${s.legal.updated}: ${content.updated}</p>
  ${content.sections.map((sec) => `<h2>${sec.h}</h2>${sec.p.map((p) => `<p>${p}</p>`).join('')}`).join('')}
</article>`;
  return layout({ lang, pageKey: which, title: s.meta[which].title, description: s.meta[which].description, body, noindex: true });
}
