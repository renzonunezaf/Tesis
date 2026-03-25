/**
 * FAIRNESS MODULE v3 — Rich visual redesign
 */
EnaraApp.renderFairness = function() {
  var container = document.getElementById('view-fairness');
  if (!container) return;

  /* ─── Data ─── */
  var groups = {
    age: {
      icon: '👤', title: 'By Age Group', sub: '1,247 patients across 4 cohorts',
      rows: [
        { label: '18–29', recall: 0.89, precision: 0.84, fpr: 0.06, n: 287 },
        { label: '30–44', recall: 0.91, precision: 0.87, fpr: 0.05, n: 412 },
        { label: '45–59', recall: 0.88, precision: 0.86, fpr: 0.07, n: 356 },
        { label: '60+',   recall: 0.79, precision: 0.82, fpr: 0.11, n: 192 }
      ]
    },
    sex: {
      icon: '⚧', title: 'By Sex', sub: 'Female / Male split',
      rows: [
        { label: 'Female', recall: 0.90, precision: 0.86, fpr: 0.06, n: 741 },
        { label: 'Male',   recall: 0.87, precision: 0.85, fpr: 0.07, n: 506 }
      ]
    },
    region: {
      icon: '🗺️', title: 'By Region', sub: '4 geographic zones',
      rows: [
        { label: 'West Coast', recall: 0.91, precision: 0.88, fpr: 0.05, n: 389 },
        { label: 'East Coast', recall: 0.89, precision: 0.85, fpr: 0.06, n: 342 },
        { label: 'Midwest',    recall: 0.87, precision: 0.84, fpr: 0.07, n: 284 },
        { label: 'South',      recall: 0.82, precision: 0.79, fpr: 0.10, n: 232 }
      ]
    },
    ethnicity: {
      icon: '🌍', title: 'By Race / Ethnicity', sub: 'Audit-only · not used operationally',
      rows: [
        { label: 'White',            recall: 0.90, precision: 0.87, fpr: 0.05, n: 498 },
        { label: 'Hispanic/Latino',  recall: 0.88, precision: 0.84, fpr: 0.07, n: 312 },
        { label: 'Black/African Am.',recall: 0.83, precision: 0.80, fpr: 0.09, n: 256 },
        { label: 'Asian',            recall: 0.91, precision: 0.88, fpr: 0.05, n: 118 },
        { label: 'Other/Not Disc.',  recall: 0.86, precision: 0.83, fpr: 0.08, n: 63 }
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
    var pct = metric === 'fpr' ? (val * 100 / 15 * 100) : (val * 100);
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
        '<div class="fgc-row-label">' + row.label + '<div style="font-size:0.6rem;font-weight:400;color:var(--color-text-muted);margin-top:1px">n=' + row.n + '</div></div>' +
        metricCell('recall', row.recall) +
        metricCell('prec.', row.precision) +
        metricCell('fpr', row.fpr) +
      '</div>';
    }).join('');
    return '<div class="fairness-group-card">' +
      '<div class="fgc-header">' +
        '<div class="fgc-icon">' + g.icon + '</div>' +
        '<div><div class="fgc-title">' + g.title + '</div><div class="fgc-sub">' + g.sub + '</div></div>' +
      '</div>' +
      '<div class="fgc-rows">' + rows + '</div>' +
    '</div>';
  }

  /* ─── Gauge helpers (SVG half-arc) ─── */
  function buildGauge(value, label, color, sub) {
    var r = 40, cx = 50, cy = 50;
    var pct = Math.min(Math.max(value, 0), 1);
    // Half-circle (180deg arc)
    var startAngle = Math.PI;
    var endAngle = Math.PI + pct * Math.PI;
    var x1 = cx + r * Math.cos(startAngle);
    var y1 = cy + r * Math.sin(startAngle);
    var x2 = cx + r * Math.cos(endAngle);
    var y2 = cy + r * Math.sin(endAngle);
    var largeArc = pct > 0.5 ? 1 : 0;

    var bgPath = 'M ' + (cx - r) + ' ' + cy + ' A ' + r + ' ' + r + ' 0 0 1 ' + (cx + r) + ' ' + cy;
    var valPath = 'M ' + x1 + ' ' + y1 + ' A ' + r + ' ' + r + ' 0 ' + largeArc + ' 1 ' + x2 + ' ' + y2;

    return '<div class="gauge-card">' +
      '<div class="gauge-svg-wrap">' +
        '<svg width="100" height="58" viewBox="0 0 100 58">' +
          '<path d="' + bgPath + '" fill="none" stroke="var(--color-border-light)" stroke-width="10" stroke-linecap="round"/>' +
          '<path d="' + valPath + '" fill="none" stroke="' + color + '" stroke-width="10" stroke-linecap="round"/>' +
        '</svg>' +
        '<div class="gauge-center">' +
          '<div class="gauge-value" style="color:' + color + '">' + Math.round(pct * 100) + '%</div>' +
        '</div>' +
      '</div>' +
      '<div class="gauge-card-title">' + label + '</div>' +
      '<div class="gauge-card-sub">' + sub + '</div>' +
    '</div>';
  }

  /* ─── Divergence chart (Recall gap from best) ─── */
  function buildDiverg(groupKey, metricKey) {
    var g = groups[groupKey];
    var vals = g.rows.map(function(r) { return r[metricKey === 'recall' ? 'recall' : metricKey === 'precision' ? 'precision' : 'fpr']; });
    var best = metricKey === 'fpr' ? Math.min.apply(null, vals) : Math.max.apply(null, vals);
    var maxDiff = 0.15;

    var rows = g.rows.map(function(row) {
      var val = metricKey === 'fpr' ? row.fpr : (metricKey === 'recall' ? row.recall : row.precision);
      var diff = metricKey === 'fpr' ? (val - best) : (val - best);
      var isPos = diff >= 0;
      var barPct = Math.abs(diff) / maxDiff * 50;
      var color = Math.abs(diff) < 0.03 ? 'var(--color-success)' : Math.abs(diff) < 0.08 ? 'var(--color-warning)' : 'var(--color-danger)';
      var sign = diff > 0 ? '+' : '';
      return '<div class="diverg-row">' +
        '<div class="diverg-row-label">' + row.label + '</div>' +
        '<div class="diverg-center-line">' +
          '<div class="diverg-axis"></div>' +
          (diff === 0 ? '' :
            isPos
              ? '<div class="diverg-bar diverg-bar--pos" style="width:' + barPct + '%;background:' + color + '"></div>'
              : '<div class="diverg-bar diverg-bar--neg" style="width:' + barPct + '%;background:' + color + '"></div>'
          ) +
        '</div>' +
        '<div class="diverg-val" style="color:' + color + '">' + sign + diff.toFixed(2) + '</div>' +
      '</div>';
    }).join('');

    return rows;
  }

  /* ─── Build HTML ─── */
  var gaugesHTML =
    '<div class="fairness-section-title">Overall Model Performance</div>' +
    '<div class="fairness-gauges">' +
      buildGauge(0.88, 'Avg Recall', 'var(--color-success)', 'Across all subgroups') +
      buildGauge(0.85, 'Avg Precision', 'var(--color-primary)', 'Across all subgroups') +
      buildGauge(1 - 0.07, 'FPR OK', 'var(--color-success)', 'Avg FPR 0.07') +
      buildGauge(0.78, 'Equity Score', 'var(--color-warning)', 'Max Recall gap 0.12') +
    '</div>';

  var disclaimerHTML =
    '<div class="fairness-disclaimer">⚠️ <div><strong>Note on Race/Ethnicity:</strong> This dimension is used exclusively for fairness auditing. It is never surfaced in operational views nor used as a prediction feature. All subgroup comparisons are for internal model governance only.</div></div>';

  var groupRowHTML =
    '<div class="fairness-section-title">Subgroup Performance</div>' +
    '<div class="fairness-group-row">' +
      buildGroupCard('age') +
      buildGroupCard('sex') +
    '</div>' +
    '<div class="fairness-group-row">' +
      buildGroupCard('region') +
      buildGroupCard('ethnicity') +
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

  /* Header */
  var headerHTML =
    '<div class="fairness-header">' +
      '<div>' +
        '<div class="fairness-headline">Model <span>Fairness</span> Review</div>' +
        '<div class="fairness-tagline">Subgroup performance monitoring · RF-SHAP v2.4 · 1,247 patients</div>' +
      '</div>' +
    '</div>' +
    '<div class="fairness-badge-row">' +
      '<div class="fbadge fbadge--ok">✓ Age parity: within tolerance</div>' +
      '<div class="fbadge fbadge--ok">✓ Sex parity: within tolerance</div>' +
      '<div class="fbadge fbadge--warn">⚠ Region: South gap detected</div>' +
      '<div class="fbadge fbadge--warn">⚠ Race/Eth: Black/Af. Am. gap</div>' +
      '<div class="fbadge fbadge--info">ℹ Audit only · not operational</div>' +
    '</div>';

  container.innerHTML = headerHTML + gaugesHTML + disclaimerHTML + groupRowHTML + divergHTML;

  /* Animate bars */
  requestAnimationFrame(function() {
    setTimeout(function() {
      container.querySelectorAll('.fgc-metric-bar-fill').forEach(function(el) {
        var pct = el.getAttribute('data-pct');
        if (pct) el.style.width = pct + '%';
      });
    }, 80);
  });
};
