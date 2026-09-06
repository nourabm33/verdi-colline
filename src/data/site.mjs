// Central business configuration. Only verified information goes here.
// Anything set to null is treated as "not available" and the matching UI is hidden.

export const site = {
  name: 'Verdi Colline',
  tagline: { it: 'B&B · Serra de\u2019 Conti', en: 'B&B · Serra de\u2019 Conti' },
  // Public URL used for canonical, hreflang, sitemap and JSON-LD.
  url: (process.env.SITE_URL || 'https://verdicolline.com').replace(/\/$/, ''),
  defaultLang: 'it',
  langs: ['it', 'en'],
  phone: '+39 329 266 1135',
  phoneHref: 'tel:+393292661135',
  whatsappHref: 'https://wa.me/393292661135',
  email: null,
  address: {
    street: 'Via Santa Lucia 45',
    locality: 'Serra de\u2019 Conti',
    region: 'Marche',
    postalCode: null,
    country: 'IT',
  },
  cin: '042046C1BE4E8HGP',
  // Booking channels: set the real URLs here to activate the buttons.
  bookingUrl: null,
  airbnbUrl: null,
  social: {
    instagram: null,
    facebook: null,
  },
  // Optional Google Maps embed URL (must use the real address). null = no map.
  mapEmbedUrl: null,
  // Optional owner story: { it: '...', en: '...' }. null = section hidden.
  ownerStory: null,
  // Optional reviews: [{ author, text: {it,en} }]. Empty = hidden.
  reviews: [],
};

export const services = [
  { icon: 'wifi', label: { it: 'Wi-Fi', en: 'Wi-Fi' } },
  { icon: 'parking', label: { it: 'Parcheggio', en: 'Parking' } },
  { icon: 'breakfast', label: { it: 'Colazione inclusa', en: 'Breakfast included' } },
  { icon: 'pets', label: { it: 'Animali di piccola taglia benvenuti', en: 'Small pets welcome' } },
];
