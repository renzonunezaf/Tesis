/**
 * VIEWS MODULE v5
 * View switching + animation triggers for all views.
 * Fixes: gauge animation, divergence bars, heatmap fade.
 */

/* ── Animation runners ── */

EnaraApp.animateKPIRings = function() {
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
  var root = container || document;
  /* Segment bars */
  root.querySelectorAll('.seg-fill[data-pct]').forEach(function(el) {
    el.style.transition = 'none';
    el.style.width = '0%';
  });
  /* Heatmap cells */
  root.querySelectorAll('.heatmap-cell').forEach(function(el) {
    el.style.transition = 'none';
    el.style.opacity = '0';
    el.style.transform = 'scale(0.7)';
  });
  /* Bubble chart */
  root.querySelectorAll('.bubble').forEach(function(el) {
    el.style.transition = 'none';
    el.style.opacity = '0';
    el.style.transform = 'scale(0)';
  });

  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      root.querySelectorAll('.seg-fill[data-pct]').forEach(function(el, i) {
        el.style.transition = 'width 0.8s cubic-bezier(0.4,0,0.2,1) ' + (i * 40) + 'ms';
        el.style.width = el.getAttribute('data-pct') + '%';
      });
      root.querySelectorAll('.heatmap-cell').forEach(function(el, i) {
        el.style.transition = 'opacity 0.4s ease ' + (i * 60) + 'ms, transform 0.4s cubic-bezier(0.34,1.56,0.64,1) ' + (i * 60) + 'ms';
        el.style.opacity = '1';
        el.style.transform = 'scale(1)';
      });
      root.querySelectorAll('.bubble').forEach(function(el, i) {
        el.style.transition = 'opacity 0.5s ease ' + (200 + i * 150) + 'ms, transform 0.6s cubic-bezier(0.34,1.56,0.64,1) ' + (200 + i * 150) + 'ms';
        el.style.opacity = '1';
        el.style.transform = 'scale(1)';
      });
    });
  });
};

EnaraApp.animateFairnessBars = function(container) {
  var root = container || document;
  /* Metric bars */
  root.querySelectorAll('.fgc-metric-bar-fill[data-pct]').forEach(function(el) {
    el.style.transition = 'none';
    el.style.width = '0%';
  });
  /* Divergence bars */
  root.querySelectorAll('.diverg-bar[data-pct]').forEach(function(el) {
    el.style.transition = 'none';
    el.style.width = '0%';
  });

  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      root.querySelectorAll('.fgc-metric-bar-fill[data-pct]').forEach(function(el, i) {
        el.style.transition = 'width 0.8s cubic-bezier(0.4,0,0.2,1) ' + (i * 30) + 'ms';
        el.style.width = el.getAttribute('data-pct') + '%';
      });
      root.querySelectorAll('.diverg-bar[data-pct]').forEach(function(el, i) {
        el.style.transition = 'width 0.7s cubic-bezier(0.4,0,0.2,1) ' + (200 + i * 80) + 'ms';
        el.style.width = el.getAttribute('data-pct') + '%';
      });
    });
  });
};

/* ── View switch ── */
EnaraApp.switchView = function(viewName) {
  document.querySelectorAll('.view').forEach(function(v) { v.classList.remove('is-active'); });
  var target = document.getElementById('view-' + viewName);
  if (target) target.classList.add('is-active');

  document.querySelectorAll('.view-tab').forEach(function(t) { t.classList.remove('is-active'); });
  document.querySelectorAll('.view-tab[data-view="' + viewName + '"]').forEach(function(t) { t.classList.add('is-active'); });

  document.querySelectorAll('.sidebar__nav a').forEach(function(a) {
    a.classList.remove('is-active');
    if (a.dataset.view === viewName) a.classList.add('is-active');
  });

  /* Re-trigger ALL animations for the newly visible view */
  if (viewName === 'operations') {
    EnaraApp.animateKPIRings();
    EnaraApp.animateDistBars();
    if (typeof EnaraApp.animateTrend === 'function') EnaraApp.animateTrend();
  } else if (viewName === 'analytics') {
    EnaraApp.animateSegBars(target);
  } else if (viewName === 'fairness') {
    EnaraApp.animateFairnessBars(target);
    if (typeof EnaraApp.animateGauges === 'function') EnaraApp.animateGauges();
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
