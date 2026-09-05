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
};

// Order of the photos in the gallery page. Add keys here to show them.
export const galleryOrder = ['panorama', 'ingresso', 'giardino', 'ulivo', 'mantide'];

export const heroImage = 'panorama';
