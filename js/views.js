/**
 * ==========================================================
 * VIEWS MODULE v7
 * View switching + animation triggers for all views.
 * Supports: operations, analytics, fairness, profile,
 * log, and model (performance).
 * ==========================================================
 */

/* ── Animation runners ── */

EnaraApp.animateKPIRings = function() {
  document.querySelectorAll('.kpi__ring-fill').forEach(function(ring) {
    var circ = 2 * Math.PI * 20;
    ring.style.transition = 'none';
    ring.style.strokeDashoffset = circ.toFixed(1);
  });
  requestAnimationFrame(function() { requestAnimationFrame(function() {
    document.querySelectorAll('.kpi__ring-fill').forEach(function(ring) {
      ring.style.transition = 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
      ring.style.strokeDashoffset = ring.dataset.target;
    });
  }); });
};

EnaraApp.animateDistBars = function() {
  document.querySelectorAll('.dist-fill').forEach(function(bar) {
    bar.style.transition = 'none'; bar.style.width = '0%';
  });
  requestAnimationFrame(function() { requestAnimationFrame(function() {
    document.querySelectorAll('.dist-fill').forEach(function(bar) {
      bar.style.transition = 'width 0.9s cubic-bezier(0.4, 0, 0.2, 1)';
      bar.style.width = bar.dataset.width;
    });
  }); });
};

EnaraApp.animateFairnessBars = function(container) {
  var root = container || document;
  root.querySelectorAll('.fgc-metric-bar-fill[data-pct]').forEach(function(el) {
    el.style.transition = 'none'; el.style.width = '0%';
  });
  root.querySelectorAll('.diverg-bar[data-pct]').forEach(function(el) {
    el.style.transition = 'none'; el.style.width = '0%';
  });
  requestAnimationFrame(function() { requestAnimationFrame(function() {
    root.querySelectorAll('.fgc-metric-bar-fill[data-pct]').forEach(function(el, i) {
      el.style.transition = 'width 0.8s cubic-bezier(0.4,0,0.2,1) ' + (i * 30) + 'ms';
      el.style.width = el.getAttribute('data-pct') + '%';
    });
    root.querySelectorAll('.diverg-bar[data-pct]').forEach(function(el, i) {
      el.style.transition = 'width 0.7s cubic-bezier(0.4,0,0.2,1) ' + (200 + i * 80) + 'ms';
      el.style.width = el.getAttribute('data-pct') + '%';
    });
  }); });
};

/* ── View switch ── */
EnaraApp.switchView = function(viewName) {
  /* Hide all views */
  document.querySelectorAll('.view').forEach(function(v) { v.classList.remove('is-active'); });
  var target = document.getElementById('view-' + viewName);
  if (target) target.classList.add('is-active');

  /* Update topbar tabs */
  document.querySelectorAll('.view-tab').forEach(function(t) { t.classList.remove('is-active'); });
  document.querySelectorAll('.view-tab[data-view="' + viewName + '"]').forEach(function(t) { t.classList.add('is-active'); });

  /* Update sidebar nav */
  document.querySelectorAll('.sidebar__nav a').forEach(function(a) {
    a.classList.remove('is-active');
    if (a.dataset.view === viewName) a.classList.add('is-active');
  });

  /* Trigger animations for the active view */
  if (viewName === 'operations') {
    EnaraApp.animateKPIRings();
    EnaraApp.animateDistBars();
    if (typeof EnaraApp.animateTrend === 'function') EnaraApp.animateTrend();
  } else if (viewName === 'analytics') {
    if (typeof EnaraApp.animateAnalytics === 'function') EnaraApp.animateAnalytics(target);
  } else if (viewName === 'fairness') {
    EnaraApp.animateFairnessBars(target);
    if (typeof EnaraApp.animateGauges === 'function') EnaraApp.animateGauges();
  } else if (viewName === 'profile') {
    if (typeof EnaraApp.animateProfileGauges === 'function') EnaraApp.animateProfileGauges();
  } else if (viewName === 'log') {
    /* Log entries animate via CSS on render — no JS trigger needed */
  } else if (viewName === 'model') {
    /* Model is already rendered by loadDashboard — animate on every visit */
    if (typeof EnaraApp.animateModelPerformance === 'function') EnaraApp.animateModelPerformance(target);
  }
};

EnaraApp.initViews = function() {
  document.querySelectorAll('.view-tab').forEach(function(tab) {
    tab.addEventListener('click', function() { EnaraApp.switchView(tab.dataset.view); });
  });
  document.querySelectorAll('.sidebar__nav a[data-view]').forEach(function(link) {
    link.addEventListener('click', function(e) { e.preventDefault(); EnaraApp.switchView(link.dataset.view); });
  });
};
