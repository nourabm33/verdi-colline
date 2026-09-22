// Photo library. Source files live in src/images/. The build generates
// responsive WebP + JPEG variants for each entry.
// `trimBottom` crops the camera watermark from the bottom of the original.
// To add photos: drop the file in src/images/ and add an entry here.

export const images = {
  panorama: {
    file: 'panorama.jpg',
    trimBottom: 130,
    alt: {
      it: 'Panorama sulle colline marchigiane e la costa dal B&B Verdi Colline, Serra de\u2019 Conti',
      en: 'Panorama over the Marche hills and coast from Verdi Colline B&B, Serra de\u2019 Conti',
    },
  },
  ingresso: {
    file: 'ingresso.jpg',
    trimBottom: 0,
    alt: {
      it: 'Ingresso del B&B Verdi Colline con piante di limone e targa',
      en: 'Entrance of Verdi Colline B&B with lemon trees and sign',
    },
  },
  giardino: {
    file: 'giardino.jpg',
    trimBottom: 130,
    alt: {
      it: 'Giardino di Verdi Colline con grande albero dalle foglie dorate in autunno',
      en: 'Verdi Colline garden with a large golden-leaved tree in autumn',
    },
  },
  ulivo: {
    file: 'ulivo.jpg',
    trimBottom: 0,
    alt: {
      it: 'Ulivo nel giardino di Verdi Colline con le colline sullo sfondo',
      en: 'Olive tree in the Verdi Colline garden with the hills in the background',
    },
  },
  mantide: {
    file: 'mantide.jpg',
    trimBottom: 130,
    alt: {
      it: 'Mantide religiosa tra le foglie nel giardino di Verdi Colline',
      en: 'Praying mantis among the leaves in the Verdi Colline garden',
    },
  },
  'sun-living': {
    file: 'sun-living.jpg',
    trimBottom: 130,
    alt: {
      it: 'Zona living dell\u2019Appartamento Sun con divano, tavolo da pranzo e cucina',
      en: 'Living area of the Sun Apartment with sofa, dining table and kitchen',
    },
  },
  'sun-cucina': {
    file: 'sun-cucina.jpg',
    trimBottom: 130,
    alt: {
      it: 'Cucina dell\u2019Appartamento Sun con vista sulla zona living',
      en: 'Kitchen of the Sun Apartment looking onto the living area',
    },
  },
  'sun-vista': {
    file: 'sun-vista.jpg',
    trimBottom: 0,
    alt: {
      it: 'Vista sulle colline marchigiane dal balcone dell\u2019Appartamento Sun',
      en: 'View over the Marche hills from the balcony of the Sun Apartment',
    },
  },
  'sun-scala': {
    file: 'sun-scala.jpg',
    trimBottom: 130,
    alt: {
      it: 'Scala interna dell\u2019Appartamento Sun con opere d\u2019arte alle pareti',
      en: 'Interior staircase of the Sun Apartment with artwork on the walls',
    },
  },
  'sun-ingresso': {
    file: 'sun-ingresso.jpg',
    trimBottom: 130,
    alt: {
      it: 'Ingresso dell\u2019Appartamento Sun con porta scorrevole e parquet',
      en: 'Entrance of the Sun Apartment with sliding door and wooden floor',
    },
  },
};

// Order of the photos in the gallery page. Add keys here to show them.
export const galleryOrder = ['panorama', 'ingresso', 'sun-living', 'giardino', 'sun-cucina', 'sun-vista', 'ulivo', 'sun-scala', 'mantide', 'sun-ingresso'];

export const heroImage = 'panorama';
