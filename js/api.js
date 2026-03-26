/**
 * ==========================================================
 * API SERVICE LAYER
 * Centralized data access. Currently returns mock data from
 * the data/ modules. In production, replace each method body
 * with a fetch() call to the real API endpoints.
 *
 * Usage:
 *   EnaraApp.api.getPatients().then(function(data) { ... });
 *
 * Every method returns a Promise so the calling code is
 * already async-ready for the backend swap.
 * ==========================================================
 */

window.EnaraApp = window.EnaraApp || {};

EnaraApp.api = {

  /** Base URL — change when backend is deployed */
  BASE_URL: '/api/v1',

  /* ── Patients ── */

  /** @returns {Promise<Array>} Full patient roster */
  getPatients: function () {
    /* MOCK: return local data wrapped in a resolved Promise */
    return Promise.resolve(EnaraApp.PATIENTS);
  },

  /** @param {string} id - Patient ID (e.g. "P-4521") */
  getPatientById: function (id) {
    var p = EnaraApp.PATIENTS.find(function (x) { return x.id === id; });
    return p ? Promise.resolve(p) : Promise.reject(new Error('Patient not found: ' + id));
  },

  /* ── KPIs ── */

  /** @returns {Promise<Array>} KPI card data */
  getKPIs: function () {
    return Promise.resolve(EnaraApp.KPI_DATA);
  },

  /* ── Analytics & distributions ── */

  getDistribution: function () {
    return Promise.resolve(EnaraApp.DISTRIBUTION);
  },

  getTrend: function () {
    return Promise.resolve(EnaraApp.TREND_DATA);
  },

  getSegments: function () {
    return Promise.resolve(EnaraApp.SEGMENTS);
  },

  /* ── Fairness ── */

  /** @returns {Promise<Object>} Fairness subgroup metrics */
  getFairnessData: function () {
    return Promise.resolve(EnaraApp.FAIRNESS_DATA);
  },

  /* ── Model Performance ── */

  getModelComparison: function () {
    return Promise.resolve(EnaraApp.MODEL_COMPARISON);
  },

  /* ── Intervention Log ── */

  getInterventionLog: function () {
    return Promise.resolve(EnaraApp.INTERVENTIONS);
  }

  /*
   * ── Production example ──
   * When connecting to a real backend, replace a method like:
   *
   * getPatients: function () {
   *   return fetch(this.BASE_URL + '/patients', {
   *     headers: { 'Authorization': 'Bearer ' + EnaraApp.auth.token }
   *   }).then(function (res) { return res.json(); });
   * }
   */
};
