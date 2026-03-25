/**
 * FAIRNESS MODULE v5
 * - Removed race/ethnicity section entirely
 * - Fixed n=xxx display as clean chip badges
 * - Added SVG gauge stroke animation
 * - Added metric bar animation triggers
 */
EnaraApp.renderFairness = function() {
  var container = document.getElementById('view-fairness');
  if (!container) return;

  /* ─── Data (ethnicity removed) ─── */
  var groups = {
    age: {
      icon: 'userAge', title: 'By Age Group', sub: '1,247 patients across 4 cohorts',
      rows: [
        { label: '18–29', recall: 0.89, precision: 0.84, fpr: 0.06, n: 287 },
        { label: '30–44', recall: 0.91, precision: 0.87, fpr: 0.05, n: 412 },
        { label: '45–59', recall: 0.88, precision: 0.86, fpr: 0.07, n: 356 },
        { label: '60+',   recall: 0.79, precision: 0.82, fpr: 0.11, n: 192 }
      ]
    },
    sex: {
      icon: 'sexIcon', title: 'By Sex', sub: 'Female / Male split',
      rows: [
        { label: 'Female', recall: 0.90, precision: 0.86, fpr: 0.06, n: 741 },
        { label: 'Male',   recall: 0.87, precision: 0.85, fpr: 0.07, n: 506 }
      ]
    },
    region: {
      icon: 'globe', title: 'By Region', sub: '4 geographic zones',
      rows: [
        { label: 'West Coast', recall: 0.91, precision: 0.88, fpr: 0.05, n: 389 },
        { label: 'East Coast', recall: 0.89, precision: 0.85, fpr: 0.06, n: 342 },
        { label: 'Midwest',    recall: 0.87, precision: 0.84, fpr: 0.07, n: 284 },
        { label: 'South',      recall: 0.82, precision: 0.79, fpr: 0.10, n: 232 }
      ]
    }
  };

  function classify(metric, val) {
    if (metric === 'fpr') {
      if (val <= 0.07) return 'good';
      if (val <= 0.09) return 'warn';
      return 'bad';
    }
    if (val >= 0.87) return 'good';
    if (val >= 0.82) return 'warn';
    return 'bad';
  }

  function metricCell(metric, val) {
    var cls = classify(metric, val);
    var pct = metric === 'fpr' ? (val / 0.15 * 100) : (val * 100);
    return '<div class="fgc-metric">' +
      '<div class="fgc-metric-name">' + metric.toUpperCase() + '</div>' +
      '<div class="fgc-metric-bar-wrap">' +
        '<div class="fgc-metric-bar-track"><div class="fgc-metric-bar-fill fgc-metric-bar-fill--' + cls + '" data-pct="' + Math.min(pct, 100).toFixed(0) + '"></div></div>' +
        '<div class="fgc-metric-val fgc-metric-val--' + cls + '">' + val.toFixed(2) + '</div>' +
      '</div>' +
    '</div>';
  }

  function buildGroupCard(key) {
    var g = groups[key];
    var rows = g.rows.map(function(row) {
      return '<div class="fgc-row">' +
        '<div class="fgc-row-label">' +
          '<span class="fgc-row-name">' + row.label + '</span>' +
          '<span class="fgc-row-n">' + row.n + '</span>' +
        '</div>' +
        metricCell('recall', row.recall) +
        metricCell('prec.', row.precision) +
        metricCell('fpr', row.fpr) +
      '</div>';
    }).join('');
    return '<div class="fairness-group-card">' +
      '<div class="fgc-header">' +
        '<div class="fgc-icon" data-fgc-icon="' + g.icon + '"></div>' +
        '<div><div class="fgc-title">' + g.title + '</div><div class="fgc-sub">' + g.sub + '</div></div>' +
      '</div>' +
      '<div class="fgc-rows">' + rows + '</div>' +
    '</div>';
  }

  /* ─── Animated SVG half-arc gauge ─── */
  function buildGauge(value, label, color, sub, id) {
    var r = 40, cx = 50, cy = 50;
    var pct = Math.min(Math.max(value, 0), 1);
    /* Half-circle arc path */
    var bgPath = 'M ' + (cx - r) + ' ' + cy + ' A ' + r + ' ' + r + ' 0 0 1 ' + (cx + r) + ' ' + cy;
    /* Calculate the total arc length for half-circle */
    var arcLength = Math.PI * r;
    var fillLength = arcLength * pct;

    return '<div class="gauge-card">' +
      '<div class="gauge-svg-wrap">' +
        '<svg width="100" height="58" viewBox="0 0 100 58">' +
          '<path d="' + bgPath + '" fill="none" stroke="var(--color-border-light)" stroke-width="10" stroke-linecap="round"/>' +
          '<path class="gauge-arc" d="' + bgPath + '" fill="none" stroke="' + color + '" stroke-width="10" stroke-linecap="round" ' +
            'stroke-dasharray="' + arcLength.toFixed(1) + '" ' +
            'stroke-dashoffset="' + arcLength.toFixed(1) + '" ' +
            'data-target="' + (arcLength - fillLength).toFixed(1) + '"/>' +
        '</svg>' +
        '<div class="gauge-center">' +
          '<div class="gauge-value" style="color:' + color + '">' + Math.round(pct * 100) + '%</div>' +
        '</div>' +
      '</div>' +
      '<div class="gauge-card-title">' + label + '</div>' +
      '<div class="gauge-card-sub">' + sub + '</div>' +
    '</div>';
  }

  /* ─── Divergence chart ─── */
  function buildDiverg(groupKey, metricKey) {
    var g = groups[groupKey];
    var vals = g.rows.map(function(r) { return r[metricKey]; });
    var best = metricKey === 'fpr' ? Math.min.apply(null, vals) : Math.max.apply(null, vals);
    var maxDiff = 0.15;

    return g.rows.map(function(row) {
      var val = row[metricKey];
      var diff = val - best;
      var barPct = Math.abs(diff) / maxDiff * 50;
      var color = Math.abs(diff) < 0.03 ? 'var(--color-success)' : Math.abs(diff) < 0.08 ? 'var(--color-warning)' : 'var(--color-danger)';
      var sign = diff > 0 ? '+' : '';
      var barDir = diff >= 0 ? 'pos' : 'neg';
      return '<div class="diverg-row">' +
        '<div class="diverg-row-label">' + row.label + '</div>' +
        '<div class="diverg-center-line">' +
          '<div class="diverg-axis"></div>' +
          (diff === 0 ? '' : '<div class="diverg-bar diverg-bar--' + barDir + '" style="background:' + color + '" data-pct="' + barPct.toFixed(0) + '"></div>') +
        '</div>' +
        '<div class="diverg-val" style="color:' + color + '">' + sign + diff.toFixed(2) + '</div>' +
      '</div>';
    }).join('');
  }

  /* ─── Assembly ─── */
  var headerHTML =
    '<div class="fairness-header">' +
      '<div>' +
        '<div class="fairness-headline">Model <span>Fairness</span> Review</div>' +
        '<div class="fairness-tagline">Subgroup performance monitoring · RF-SHAP v2.4 · 1,247 patients</div>' +
      '</div>' +
    '</div>' +
    '<div class="fairness-badge-row">' +
      '<div class="fbadge fbadge--ok">Age parity: within tolerance</div>' +
      '<div class="fbadge fbadge--ok">Sex parity: within tolerance</div>' +
      '<div class="fbadge fbadge--warn">Region: South gap detected</div>' +
    '</div>';

  var gaugesHTML =
    '<div class="fairness-section-title">Overall Model Performance</div>' +
    '<div class="fairness-gauges">' +
      buildGauge(0.88, 'Avg Recall', 'var(--color-success)', 'Across all subgroups') +
      buildGauge(0.85, 'Avg Precision', 'var(--color-primary)', 'Across all subgroups') +
      buildGauge(0.93, 'FPR OK', 'var(--color-success)', 'Avg FPR 0.07') +
      buildGauge(0.78, 'Equity Score', 'var(--color-warning)', 'Max Recall gap 0.12') +
    '</div>';

  var groupRowHTML =
    '<div class="fairness-section-title">Subgroup Performance</div>' +
    '<div class="fairness-group-row">' +
      buildGroupCard('age') +
      buildGroupCard('sex') +
    '</div>' +
    '<div class="fairness-group-row">' +
      buildGroupCard('region') +
    '</div>';

  var divergHTML =
    '<div class="fairness-section-title">Recall Gap from Best Subgroup</div>' +
    '<div class="fairness-diverg-row">' +
      '<div class="diverg-panel">' +
        '<div class="diverg-panel__title">Age Group — Recall deviation</div>' +
        '<div class="diverg-panel__sub">Bars show distance from best recall (0.91, 30–44)</div>' +
        '<div class="diverg-chart">' + buildDiverg('age', 'recall') + '</div>' +
      '</div>' +
      '<div class="diverg-panel">' +
        '<div class="diverg-panel__title">Region — FPR deviation</div>' +
        '<div class="diverg-panel__sub">Bars show distance from best FPR (0.05, West Coast)</div>' +
        '<div class="diverg-chart">' + buildDiverg('region', 'fpr') + '</div>' +
      '</div>' +
    '</div>';

  container.innerHTML = headerHTML + gaugesHTML + groupRowHTML + divergHTML;

  /* Inject SVG icons */
  requestAnimationFrame(function() {
    var I = window.EnaraIcons;
    if (!I) return;
    container.querySelectorAll('[data-fgc-icon]').forEach(function(el) {
      var key = el.getAttribute('data-fgc-icon');
      if (I[key]) el.innerHTML = I[key];
    });
  });
};

/* ─── Gauge animation function (called from views.js) ─── */
EnaraApp.animateGauges = function() {
  document.querySelectorAll('.gauge-arc').forEach(function(arc) {
    var arcLen = parseFloat(arc.getAttribute('stroke-dasharray'));
    arc.style.transition = 'none';
    arc.style.strokeDashoffset = arcLen + 'px';
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        arc.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
        arc.style.strokeDashoffset = arc.dataset.target + 'px';
      });
    });
  });
};
