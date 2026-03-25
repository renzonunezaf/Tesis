/**
 * ==========================================================
 * ICONS MODULE
 * Clean SVG icon system — 16px stroke-based, 1.5 stroke width
 * All icons are inline SVG strings for crisp rendering at any DPI.
 * ==========================================================
 */
window.EnaraIcons = {

  // Navigation
  dashboard:   '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/><rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/></svg>',
  patients:    '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="4.5" r="2.5"/><path d="M1 14c0-3 2-4.5 5-4.5s5 1.5 5 4.5"/><circle cx="13" cy="5" r="2"/><path d="M15 14c0-2.5-1.3-4-3.5-4"/></svg>',
  log:         '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"/><path d="M5 6h6M5 9h4"/></svg>',
  analytics:   '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12 L5 8 L8 10 L11 5 L14 7"/><path d="M11 5 L14 5 L14 8"/></svg>',
  fairness:    '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v12M4 14h8"/><path d="M3 5h10"/><path d="M2 5l2-3M14 5l-2-3"/><path d="M2 5c0 2 1.5 3.5 3 3.5S7 5 7 5"/><path d="M14 5c0 2-1.5 3.5-3 3.5S9 5 9 5"/></svg>',
  model:       '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="2.5"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2"/><path d="M3.2 3.2l1.4 1.4M11.4 11.4l1.4 1.4M3.2 12.8l1.4-1.4M11.4 4.6l1.4-1.4"/></svg>',
  profile:     '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="5.5" r="3"/><path d="M2 14c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5"/></svg>',
  settings:    '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="2"/><path d="M8 1v1.5M8 13.5V15M1 8h1.5M13.5 8H15M2.9 2.9l1 1M12.1 12.1l1 1M13.1 2.9l-1 1M3.9 12.1l-1 1"/></svg>',

  // Topbar / meta
  calendar:    '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="2.5" width="12" height="10.5" rx="1.5"/><path d="M1 6h12M4.5 1v3M9.5 1v3"/></svg>',
  brain:       '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 2C4.5 2 2.5 3.8 2.5 6c0 1.2.6 2.3 1.5 3v2h6V9c.9-.7 1.5-1.8 1.5-3 0-2.2-2-4-4.5-4z"/><path d="M5 7.5h4M7 2v1.5"/></svg>',

  // Panel titles
  distribution:'<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="6" width="2.5" height="7" rx="0.5"/><rect x="5" y="3" width="2.5" height="10" rx="0.5"/><rect x="9" y="1" width="2.5" height="12" rx="0.5"/></svg>',
  trend:       '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M1 11 L4 7 L7 9 L10 4 L13 6"/><path d="M10 4h3v3"/></svg>',
  outreach:    '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 2h10a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H8l-3 2v-2H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"/></svg>',
  star:        '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 1l1.8 3.6L13 5.3l-3 2.9.7 4.1L7 10.4 3.3 12.3l.7-4.1L1 5.3l4.2-.7z"/></svg>',
  shap:        '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="7" r="2"/><circle cx="7" cy="7" r="5.5"/><path d="M7 1.5V4M7 10v2.5M1.5 7H4M10 7h2.5"/></svg>',

  // Outreach actions
  phone:       '<svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 1.5h3l1 2.5-1.5 1c.7 1.4 1.5 2.2 3 3L9 6.5l2.5 1V10.5c0 .8-.7 1.3-1.5 1C3.5 9.5 1 5 2 2.5a1 1 0 0 1 0-1z"/></svg>',
  stethoscope: '<svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M2 1.5v4a3.5 3.5 0 0 0 7 0v-4"/><circle cx="10.5" cy="10.5" r="2"/><path d="M5.5 9.5v1.5"/></svg>',
  message:     '<svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 1.5h10a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H7.5L5 12V9.5H2.5a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1z"/></svg>',
  check:       '<svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 7l3.5 3.5L11 3.5"/></svg>',

  // Status / alert
  alert:       '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 1.5L12.5 11.5H1.5L7 1.5z"/><path d="M7 5.5v2.5M7 10h.01"/></svg>',
  info:        '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="7" r="5.5"/><path d="M7 6.5v4M7 4.5h.01"/></svg>',
  checkCircle: '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="7" r="5.5"/><path d="M4.5 7l2 2L9.5 5"/></svg>',

  // Segment icons (analytics cards)
  ageGroup:    '<svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="4.5" cy="4" r="2"/><path d="M1 12c0-2.5 1.6-3.8 3.5-3.8"/><circle cx="9.5" cy="5" r="1.5"/><path d="M12 12c0-2-1.2-3-3.5-3s-2.5 1-3 3"/></svg>',
  insurer:     '<svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 1L1.5 3v4c0 2.5 2.5 4.5 5 5 2.5-.5 5-2.5 5-5V3L6.5 1z"/></svg>',
  medication:  '<svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="1.5" y="5" width="10" height="4" rx="2"/><path d="M6.5 5V9M4 3.5h5"/></svg>',
  modality:    '<svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="1.5" y="1.5" width="10" height="7" rx="1"/><path d="M4.5 11.5h4M6.5 8.5v3"/></svg>',
  location:    '<svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 1C4.3 1 2.5 2.8 2.5 5c0 3 4 7 4 7s4-4 4-7c0-2.2-1.8-4-4-4z"/><circle cx="6.5" cy="5" r="1.5"/></svg>',
  clock:       '<svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="6.5" cy="6.5" r="5"/><path d="M6.5 3.5v3l2 1.5"/></svg>',
  gender:      '<svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="5" cy="7" r="3"/><path d="M7.5 4.5L11 1M11 1h-3M11 1v3"/></svg>',
  engagement:  '<svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 10L5 6l2.5 2.5L11 4"/><circle cx="11" cy="4" r="1.2"/></svg>',
  clinic:      '<svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 11.5V5l5-3.5 5 3.5v6.5"/><path d="M4.5 11.5V8h4v3.5"/><path d="M5.5 5.5h2M6.5 4.5v2"/></svg>',

  // Fairness page
  userAge:     '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="5" r="2.5"/><path d="M2 13c0-3 2.2-5 5-5s5 2 5 5"/></svg>',
  sexIcon:     '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="5.5" cy="8" r="3"/><path d="M8 5.5L12 1.5M12 1.5h-3M12 1.5v3"/><path d="M5.5 11v2"/><path d="M4 12.5h3"/></svg>',
  globe:       '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="7" r="5.5"/><path d="M7 1.5C5.5 3.5 4.5 5.2 4.5 7s1 3.5 2.5 5.5"/><path d="M7 1.5C8.5 3.5 9.5 5.2 9.5 7S8.5 10.5 7 12.5"/><path d="M1.5 7h11"/><path d="M2 4.5h10M2 9.5h10"/></svg>',
  diversity:   '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="4" cy="5" r="2"/><circle cx="10" cy="5" r="2"/><path d="M1 13c0-2 1.3-3 3-3s3 1 3 3"/><path d="M7 13c0-2 1.3-3 3-3s3 1 3 3"/></svg>',

  // Drawer
  close:       '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3 3l10 10M13 3L3 13"/></svg>',
};

/* Helper: render icon with optional class */
EnaraIcons.render = function(name, extraClass) {
  var svg = EnaraIcons[name] || '';
  if (extraClass && svg) {
    svg = svg.replace('<svg ', '<svg class="' + extraClass + '" ');
  }
  return svg;
};
