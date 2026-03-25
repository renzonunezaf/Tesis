/**
 * ==========================================================
 * APP MODULE
 * Initialization. Renders all components, then triggers
 * animations for the default (operations) view.
 * ==========================================================
 */
document.addEventListener('DOMContentLoaded', function() {
  /* Render all components */
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

  /* Trigger animations for the initial view (operations) */
  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      EnaraApp.animateKPIRings();
      EnaraApp.animateDistBars();
      EnaraApp.animateTrend();
    });
  });
});
