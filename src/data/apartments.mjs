// Apartments. To add a new one, append an object here: it will automatically
// appear in the listing, navigation links, internal links and sitemap.
// Set `published: false` to keep an apartment hidden until its content is ready.
// Fields set to null are hidden in the UI (never shown as placeholders).

export const apartments = [
  {
    slug: 'sun',
    published: true,
    name: { it: 'Appartamento Sun', en: 'Sun Apartment' },
    short: {
      it: 'Due camere, zona living con cucina e un balcone aperto sulle colline.',
      en: 'Two bedrooms, a living area with kitchen and a balcony opening onto the hills.',
    },
    description: {
      it: 'L\u2019Appartamento Sun offre due camere, un bagno, una zona living con cucina e un balcone con vista sulle colline marchigiane. Colazione inclusa, Wi-Fi e parcheggio disponibili. Gli animali di piccola taglia sono i benvenuti.',
      en: 'The Sun Apartment offers two bedrooms, one bathroom, a living area with kitchen and a balcony overlooking the Marche hills. Breakfast included, Wi-Fi and parking available. Small pets are welcome.',
    },
    features: [
      { icon: 'bed', it: '2 camere', en: '2 bedrooms' },
      { icon: 'guests', it: '3 posti', en: 'Sleeps 3' },
      { icon: 'bath', it: '1 bagno', en: '1 bathroom' },
      { icon: 'sofa', it: 'Zona living', en: 'Living area' },
      { icon: 'kitchen', it: 'Cucina', en: 'Kitchen' },
      { icon: 'balcony', it: 'Balcone', en: 'Balcony' },
      { icon: 'view', it: 'Vista sulle colline', en: 'Hill view' },
    ],
    occupancy: 3,
    bedrooms: 2,
    price: 110, // EUR per night; null hides the price
    breakfastIncluded: true,
    petsAllowed: true,
    parking: true,
    wifi: true,
    // Per-apartment booking channels. null = button hidden.
    bookingUrl: null,
    airbnbUrl: null,
    // Image key from src/data/gallery.mjs (property photos until interior photos are provided).
    image: 'panorama',
    imageAlt: {
      it: 'Vista sulle colline marchigiane dal B&B Verdi Colline, Serra de\u2019 Conti',
      en: 'View over the Marche hills from Verdi Colline B&B, Serra de\u2019 Conti',
    },
  },
  {
    slug: 'moon',
    published: true,
    name: { it: 'Appartamento Moon', en: 'Moon Apartment' },
    short: {
      it: 'Due camere, zona living e angolo cucina: un rifugio semplice e accogliente.',
      en: 'Two bedrooms, a living area and kitchenette: a simple, welcoming retreat.',
    },
    description: {
      it: 'L\u2019Appartamento Moon offre due camere, un bagno, una zona living e un angolo cucina. Colazione inclusa, Wi-Fi e parcheggio disponibili. Gli animali di piccola taglia sono i benvenuti.',
      en: 'The Moon Apartment offers two bedrooms, one bathroom, a living area and a kitchenette. Breakfast included, Wi-Fi and parking available. Small pets are welcome.',
    },
    features: [
      { icon: 'bed', it: '2 camere', en: '2 bedrooms' },
      { icon: 'guests', it: '3 posti', en: 'Sleeps 3' },
      { icon: 'bath', it: '1 bagno', en: '1 bathroom' },
      { icon: 'sofa', it: 'Zona living', en: 'Living area' },
      { icon: 'kitchen', it: 'Angolo cucina', en: 'Kitchenette' },
    ],
    occupancy: 3,
    bedrooms: 2,
    price: 80,
    breakfastIncluded: true,
    petsAllowed: true,
    parking: true,
    wifi: true,
    bookingUrl: null,
    airbnbUrl: null,
    image: 'giardino',
    imageAlt: {
      it: 'Giardino del B&B Verdi Colline a Serra de\u2019 Conti',
      en: 'Garden of Verdi Colline B&B in Serra de\u2019 Conti',
    },
  },
];

export const publishedApartments = apartments.filter((a) => a.published);
