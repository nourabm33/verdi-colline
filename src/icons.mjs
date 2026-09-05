const svg = (d, extra = '') =>
  `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${d}${extra}</svg>`;

export const icons = {
  wifi: svg('<path d="M2 8.8a15 15 0 0 1 20 0"/><path d="M5.5 12.5a10 10 0 0 1 13 0"/><path d="M9 16.2a5 5 0 0 1 6 0"/><circle cx="12" cy="19.5" r=".8" fill="currentColor"/>'),
  parking: svg('<rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="M9.5 16.5v-9h3.2a2.8 2.8 0 0 1 0 5.6H9.5"/>'),
  breakfast: svg('<path d="M4 9h11v5a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"/><path d="M15 10h1.5a2.5 2.5 0 0 1 0 5H15"/><path d="M3 21h14"/><path d="M8 5.5c0-1 .8-1 .8-2M11 5.5c0-1 .8-1 .8-2"/>'),
  pets: svg('<path d="M12 20c-2.5 0-4.5-1.4-4.5-3.4 0-1.6 1.5-2.4 2.3-3.6.7-1 1-2 2.2-2s1.5 1 2.2 2c.8 1.2 2.3 2 2.3 3.6 0 2-2 3.4-4.5 3.4z"/><circle cx="6" cy="10" r="1.6"/><circle cx="18" cy="10" r="1.6"/><circle cx="9" cy="6" r="1.6"/><circle cx="15" cy="6" r="1.6"/>'),
  bed: svg('<path d="M3 18v-7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7"/><path d="M3 15h18"/><path d="M6 9V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2"/>'),
  guests: svg('<circle cx="9" cy="8" r="3"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><circle cx="17" cy="9" r="2.4"/><path d="M15.5 14.2a4.5 4.5 0 0 1 5.5 4.8"/>'),
  bath: svg('<path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"/><path d="M6 12V6.5A2.5 2.5 0 0 1 8.5 4h.5"/><path d="M7 21v-2M17 21v-2"/>'),
  sofa: svg('<path d="M5 11V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3"/><path d="M3 13a2 2 0 0 1 4 0v3h10v-3a2 2 0 0 1 4 0v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>'),
  kitchen: svg('<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 11h16"/><circle cx="8.5" cy="7.5" r="1"/><circle cx="12" cy="7.5" r="1"/><circle cx="15.5" cy="7.5" r="1"/>'),
  balcony: svg('<path d="M3 21h18"/><path d="M4 13h16v8"/><path d="M4 21v-8"/><path d="M7 13v8M10 13v8M13 13v8M16 13v8"/><path d="M8 13V6a4 4 0 0 1 8 0v7"/>'),
  view: svg('<path d="M3 18l5-7 4 5 3-3 6 5z"/><circle cx="17" cy="7" r="2.5"/>'),
  phone: svg('<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>'),
  whatsapp: svg('<path d="M4 20l1.3-3.9A8.5 8.5 0 1 1 8 19z"/><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1.2-1.4-1.9-1-.9.8a3.8 3.8 0 0 1-2.3-2.3l.8-.9-1-1.9z"/>'),
  pin: svg('<path d="M12 21s-6-5.5-6-11a6 6 0 0 1 12 0c0 5.5-6 11-6 11z"/><circle cx="12" cy="10" r="2.2"/>'),
  arrow: svg('<path d="M5 12h14"/><path d="M13 6l6 6-6 6"/>'),
  close: svg('<path d="M6 6l12 12M18 6L6 18"/>'),
  chevronLeft: svg('<path d="M15 5l-7 7 7 7"/>'),
  chevronRight: svg('<path d="M9 5l7 7-7 7"/>'),
};
