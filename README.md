# Verdi Colline – B&B Serra de’ Conti

Static, bilingual (IT/EN) website. No framework at runtime: content lives in `src/data/*.mjs`, strings in `src/i18n.mjs`, templates in `src/templates.mjs`.

```bash
npm install
npm run build   # → dist/  (set SITE_URL=https://your-domain to change canonical URLs)
npm run dev     # build + serve dist on http://localhost:5173
```

Deploy `dist/` to any static host. Pushes to `main` are deployed automatically to GitHub Pages by `.github/workflows/pages.yml` (repo Settings → Pages → Source: **GitHub Actions**). Set the repository variable `SITE_URL` when moving to a custom domain.

## Editing content

- Business facts (phone, address, CIN, Booking/Airbnb URLs, email, socials): `src/data/site.mjs`. Fields left `null` are hidden on the site.
- Apartments: append an object to `src/data/apartments.mjs`. Listing, detail pages, links, JSON-LD and sitemap update automatically.
- Photos: drop the file in `src/images/` and register it in `src/data/gallery.mjs` (with IT/EN alt text). Responsive WebP/JPEG variants are generated at build time.
- Destinations: `src/data/destinations.mjs` (`distance: null` hides the distance line).
- Legal texts: `src/legal.mjs`.
