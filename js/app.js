/**
 * ==========================================================
 * APP MODULE
 * Application initialization. Loads all modules and performs
 * initial render.
 * ==========================================================
 */
document.addEventListener('DOMContentLoaded', function() {
  /* Render static components */
  EnaraApp.renderKPIs();
  EnaraApp.renderDistribution();
  EnaraApp.renderTrend();
  EnaraApp.renderAnalytics();
  EnaraApp.renderFairness();

  /* Sort and render patient table */
  EnaraApp.sortPatients();
  EnaraApp.renderTable();

  /* Initialize interactive behaviors */
  EnaraApp.initSortHeaders();
  EnaraApp.initFilters();
  EnaraApp.initDrawer();
  EnaraApp.initViews();
});
