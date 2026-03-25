/**
 * ==========================================================
 * VIEWS MODULE v2
 * Handles switching between views and re-triggers animations
 * every time a view becomes active.
 * ==========================================================
 */

/* ── Animation runners ── */

EnaraApp.animateKPIRings = function() {
  /* Reset all rings to 0, then animate to target */
  document.querySelectorAll('.kpi__ring-fill').forEach(function(ring) {
    var circ = 2 * Math.PI * 20;
    ring.style.transition = 'none';
    ring.style.strokeDashoffset = circ.toFixed(1);
  });
  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      document.querySelectorAll('.kpi__ring-fill').forEach(function(ring) {
        ring.style.transition = 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        ring.style.strokeDashoffset = ring.dataset.target;
      });
    });
  });
};

EnaraApp.animateDistBars = function() {
  document.querySelectorAll('.dist-fill').forEach(function(bar) {
    bar.style.transition = 'none';
    bar.style.width = '0%';
  });
  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      document.querySelectorAll('.dist-fill').forEach(function(bar) {
        bar.style.transition = 'width 0.9s cubic-bezier(0.4, 0, 0.2, 1)';
        bar.style.width = bar.dataset.width;
      });
    });
  });
};

EnaraApp.animateSegBars = function(container) {
  var els = (container || document).querySelectorAll('.seg-fill[data-pct]');
  els.forEach(function(el) {
    el.style.transition = 'none';
    el.style.width = '0%';
  });
  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      els.forEach(function(el) {
        el.style.transition = 'width 1s cubic-bezier(0.4, 0, 0.2, 1)';
        el.style.width = el.getAttribute('data-pct') + '%';
      });
    });
  });
};

EnaraApp.animateFairnessBars = function(container) {
  var els = (container || document).querySelectorAll('.fgc-metric-bar-fill[data-pct]');
  els.forEach(function(el) {
    el.style.transition = 'none';
    el.style.width = '0%';
  });
  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      els.forEach(function(el) {
        el.style.transition = 'width 1s cubic-bezier(0.4, 0, 0.2, 1)';
        el.style.width = el.getAttribute('data-pct') + '%';
      });
    });
  });
};

/* ── View switch ── */

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

  /* Re-trigger animations for the newly visible view */
  if (viewName === 'operations') {
    EnaraApp.animateKPIRings();
    EnaraApp.animateDistBars();
    EnaraApp.animateTrend();
  } else if (viewName === 'analytics') {
    EnaraApp.animateSegBars(target);
  } else if (viewName === 'fairness') {
    EnaraApp.animateFairnessBars(target);
  }
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
