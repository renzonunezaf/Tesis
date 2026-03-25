/**
 * ==========================================================
 * VIEWS MODULE
 * Handles switching between Operations, Analytics, and
 * Fairness views via topbar tabs and sidebar links.
 * ==========================================================
 */
EnaraApp.switchView = function(viewName) {
  /* Toggle view panels */
  document.querySelectorAll('.view').forEach(function(v) {
    v.classList.remove('is-active');
  });
  var target = document.getElementById('view-' + viewName);
  if (target) target.classList.add('is-active');

  /* Toggle topbar tabs */
  document.querySelectorAll('.view-tab').forEach(function(t) {
    t.classList.remove('is-active');
  });
  document.querySelectorAll('.view-tab[data-view="' + viewName + '"]').forEach(function(t) {
    t.classList.add('is-active');
  });

  /* Toggle sidebar links */
  document.querySelectorAll('.sidebar__nav a').forEach(function(a) {
    a.classList.remove('is-active');
    if (a.dataset.view === viewName) a.classList.add('is-active');
  });
};

EnaraApp.initViews = function() {
  document.querySelectorAll('.view-tab').forEach(function(tab) {
    tab.addEventListener('click', function() {
      EnaraApp.switchView(tab.dataset.view);
    });
  });

  document.querySelectorAll('.sidebar__nav a[data-view]').forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      EnaraApp.switchView(link.dataset.view);
    });
  });
};
