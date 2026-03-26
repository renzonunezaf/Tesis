/**
 * ==========================================================
 * APP MODULE — Application Entry Point
 *
 * Orchestrates data loading through api.js, shows loading
 * skeletons while data is in transit, handles errors with
 * retry, and passes data to each renderer as a parameter.
 *
 * No module reads data globals directly — all data flows
 * through this orchestrator via api -> module(data).
 * ==========================================================
 */

document.addEventListener('DOMContentLoaded', function () {

  /* Initialize UI behaviors (no data needed) */
  EnaraApp.initSortHeaders();
  EnaraApp.initFilters();
  EnaraApp.initDrawer();
  EnaraApp.initViews();
  EnaraApp.initSidebar();

  /* Show loading skeletons */
  EnaraApp.showLoading('kpi-row', 'kpi');
  EnaraApp.showLoading('table-body', 'table');
  EnaraApp.showLoading('dist-bars', 'chart');

  /* Fetch all data in parallel */
  EnaraApp.loadDashboard();
});

/**
 * Main data loader. Fetches all datasets in parallel,
 * then renders each module. Can be called again for refresh.
 */
EnaraApp.loadDashboard = function () {

  Promise.all([
    EnaraApp.api.getPatients(),
    EnaraApp.api.getKPIs(),
    EnaraApp.api.getDistribution(),
    EnaraApp.api.getTrend(),
    EnaraApp.api.getSegments(),
    EnaraApp.api.getFairnessData(),
    EnaraApp.api.getModelComparison(),
    EnaraApp.api.getInterventionLog()
  ]).then(function (results) {
    var patients      = results[0];
    var kpis          = results[1];
    var distribution  = results[2];
    var trend         = results[3];
    var segments      = results[4];
    var fairnessData  = results[5];
    var models        = results[6];
    var interventions = results[7];

    /* Store patients in state for filters/table/drawer */
    EnaraApp.state.allPatients = patients;
    EnaraApp.state.filteredPatients = patients.slice();

    /* Render all modules with their data */
    EnaraApp.renderKPIs(kpis);
    EnaraApp.renderDistribution(distribution);
    EnaraApp.renderTrend(trend);

    EnaraApp.sortPatients();
    EnaraApp.renderTable();

    EnaraApp.renderAnalytics(segments);
    EnaraApp.renderFairness(fairnessData);
    EnaraApp.renderModelPerformance(models);
    EnaraApp.renderLog(interventions, patients);

  }).catch(function (err) {
    /* Global error fallback */
    console.error('[Enara] Dashboard load failed:', err);
    EnaraApp.showError('kpi-row', 'Failed to load dashboard data.', EnaraApp.loadDashboard);
  });
};

/**
 * Responsive sidebar: hamburger toggle, overlay close,
 * and auto-close on nav click (mobile).
 */
EnaraApp.initSidebar = function () {
  var sidebar = document.getElementById('sidebar');
  var overlay = document.getElementById('sidebar-overlay');
  var hamburger = document.getElementById('hamburger');

  if (!sidebar || !overlay || !hamburger) return;

  function openSidebar() {
    sidebar.classList.add('is-open');
    overlay.classList.add('is-open');
  }

  function closeSidebar() {
    sidebar.classList.remove('is-open');
    overlay.classList.remove('is-open');
  }

  hamburger.addEventListener('click', function () {
    sidebar.classList.contains('is-open') ? closeSidebar() : openSidebar();
  });

  overlay.addEventListener('click', closeSidebar);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeSidebar();
  });

  sidebar.querySelectorAll('a[data-view]').forEach(function (link) {
    link.addEventListener('click', function () {
      if (window.innerWidth <= 768) closeSidebar();
    });
  });
};
