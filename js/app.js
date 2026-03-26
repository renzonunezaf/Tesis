/**
 * ==========================================================
 * APP MODULE
 * Application initialization. Loads all modules and performs
 * initial render. Includes responsive sidebar toggle.
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
  EnaraApp.initSidebar();
});

/**
 * Responsive sidebar: hamburger toggle, overlay close,
 * and auto-close on nav click (mobile).
 */
EnaraApp.initSidebar = function() {
  var sidebar = document.getElementById('sidebar');
  var overlay = document.getElementById('sidebar-overlay');
  var hamburger = document.getElementById('hamburger');

  if (!sidebar || !overlay || !hamburger) return;

  /* Toggle sidebar open/close */
  function openSidebar() {
    sidebar.classList.add('is-open');
    overlay.classList.add('is-open');
  }

  function closeSidebar() {
    sidebar.classList.remove('is-open');
    overlay.classList.remove('is-open');
  }

  hamburger.addEventListener('click', function() {
    if (sidebar.classList.contains('is-open')) {
      closeSidebar();
    } else {
      openSidebar();
    }
  });

  /* Close on overlay tap */
  overlay.addEventListener('click', closeSidebar);

  /* Close on Escape */
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeSidebar();
  });

  /* Auto-close sidebar on nav click (mobile only) */
  sidebar.querySelectorAll('a[data-view]').forEach(function(link) {
    link.addEventListener('click', function() {
      if (window.innerWidth <= 768) {
        closeSidebar();
      }
    });
  });
};
