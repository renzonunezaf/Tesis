/**
 * ==========================================================
 * FAIRNESS DATA
 * Mock fairness audit metrics by subgroup.
 * In production: EnaraApp.api.getFairnessData() will fetch
 * from the backend instead of reading this constant.
 * ==========================================================
 */

window.EnaraApp = window.EnaraApp || {};

EnaraApp.FAIRNESS_DATA = {
  age: {
    title: 'By Age Group',
    sub: '1,247 patients across 4 cohorts',
    rows: [
      { label: '18–29', recall: 0.89, precision: 0.84, fpr: 0.06, n: 287 },
      { label: '30–44', recall: 0.91, precision: 0.87, fpr: 0.05, n: 412 },
      { label: '45–59', recall: 0.88, precision: 0.86, fpr: 0.07, n: 356 },
      { label: '60+',   recall: 0.79, precision: 0.82, fpr: 0.11, n: 192 }
    ]
  },
  sex: {
    title: 'By Sex',
    sub: 'Female / Male split',
    rows: [
      { label: 'Female', recall: 0.90, precision: 0.86, fpr: 0.06, n: 741 },
      { label: 'Male',   recall: 0.87, precision: 0.85, fpr: 0.07, n: 506 }
    ]
  },
  region: {
    title: 'By Region',
    sub: '4 geographic zones',
    rows: [
      { label: 'West Coast', recall: 0.91, precision: 0.88, fpr: 0.05, n: 389 },
      { label: 'East Coast', recall: 0.89, precision: 0.85, fpr: 0.06, n: 342 },
      { label: 'Midwest',    recall: 0.87, precision: 0.84, fpr: 0.07, n: 284 },
      { label: 'South',      recall: 0.82, precision: 0.79, fpr: 0.10, n: 232 }
    ]
  },
  ethnicity: {
    title: 'By Race / Ethnicity',
    sub: 'Audit-only — not used operationally',
    rows: [
      { label: 'White',            recall: 0.90, precision: 0.87, fpr: 0.05, n: 498 },
      { label: 'Hispanic/Latino',  recall: 0.88, precision: 0.84, fpr: 0.07, n: 312 },
      { label: 'Black/Af. Am.',    recall: 0.83, precision: 0.80, fpr: 0.09, n: 256 },
      { label: 'Asian',            recall: 0.91, precision: 0.88, fpr: 0.05, n: 118 },
      { label: 'Other/Not Disc.',  recall: 0.86, precision: 0.83, fpr: 0.08, n: 63 }
    ]
  }
};

/** Overall model averages (used for parity comparisons) */
EnaraApp.FAIRNESS_AVERAGES = {
  recall: 0.88,
  precision: 0.85,
  fpr: 0.07
};

/** Region display configuration */
EnaraApp.REGION_CONFIG = {
  west:    { label: 'West Coast', color: 'var(--color-region-west)' },
  east:    { label: 'East Coast', color: 'var(--color-region-east)' },
  midwest: { label: 'Midwest',    color: 'var(--color-region-midwest)' },
  south:   { label: 'South',      color: 'var(--color-region-south)' }
};
