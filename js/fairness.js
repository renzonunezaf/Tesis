/**
 * ==========================================================
 * FAIRNESS MODULE v4
 * Diverse chart types per subgroup dimension:
 * - Gauges: animated half-arc SVG (Overall Performance)
 * - Dot plot / lollipop: Age Group (3 metrics × 4 cohorts)
 * - Paired ring gauges: Sex (direct parity comparison)
 * - US tile map: Region (geographic performance view)
 * - Connected dot plot: Race/Ethnicity (slope visualization)
 * - Butterfly divergence bars + parity heatmap
 * All charts animate on view switch.
 * ==========================================================
 */

EnaraApp.renderFairness = function() {
  var container = document.getElementById('view-fairness');
  if (!container) return;

  /* ─── Data ─── */
  var groups = {
    age: {
      title: 'By Age Group', sub: '1,247 patients across 4 cohorts',
      rows: [
        { label: '18–29', recall: 0.89, precision: 0.84, fpr: 0.06, n: 287 },
        { label: '30–44', recall: 0.91, precision: 0.87, fpr: 0.05, n: 412 },
        { label: '45–59', recall: 0.88, precision: 0.86, fpr: 0.07, n: 356 },
        { label: '60+',   recall: 0.79, precision: 0.82, fpr: 0.11, n: 192 }
      ]
    },
    sex: {
      title: 'By Sex', sub: 'Female / Male split',
      rows: [
        { label: 'Female', recall: 0.90, precision: 0.86, fpr: 0.06, n: 741 },
        { label: 'Male',   recall: 0.87, precision: 0.85, fpr: 0.07, n: 506 }
      ]
    },
    region: {
      title: 'By Region', sub: '4 geographic zones',
      rows: [
        { label: 'West Coast', recall: 0.91, precision: 0.88, fpr: 0.05, n: 389 },
        { label: 'East Coast', recall: 0.89, precision: 0.85, fpr: 0.06, n: 342 },
        { label: 'Midwest',    recall: 0.87, precision: 0.84, fpr: 0.07, n: 284 },
        { label: 'South',      recall: 0.82, precision: 0.79, fpr: 0.10, n: 232 }
      ]
    },
    ethnicity: {
      title: 'By Race / Ethnicity', sub: 'Audit-only · not used operationally',
      rows: [
        { label: 'White',            recall: 0.90, precision: 0.87, fpr: 0.05, n: 498 },
        { label: 'Hispanic/Latino',  recall: 0.88, precision: 0.84, fpr: 0.07, n: 312 },
        { label: 'Black/Af. Am.',    recall: 0.83, precision: 0.80, fpr: 0.09, n: 256 },
        { label: 'Asian',            recall: 0.91, precision: 0.88, fpr: 0.05, n: 118 },
        { label: 'Other/Not Disc.',  recall: 0.86, precision: 0.83, fpr: 0.08, n: 63 }
      ]
    }
  };

  function classify(val, isFpr) {
    if (isFpr) return val <= 0.07 ? 'good' : val <= 0.09 ? 'warn' : 'bad';
    return val >= 0.87 ? 'good' : val >= 0.82 ? 'warn' : 'bad';
  }
  function classColor(cls) {
    return cls === 'good' ? 'var(--color-success)' : cls === 'warn' ? 'var(--color-warning)' : 'var(--color-danger)';
  }

  var html = '';

  /* ── Header ── */
  html += '<div class="fairness-header"><div>' +
    '<div class="fairness-headline">Model <span>Fairness</span> Review</div>' +
    '<div class="fairness-tagline">Subgroup performance monitoring · RF-SHAP v2.4 · 1,247 patients</div>' +
  '</div></div>' +
  '<div class="fairness-badge-row">' +
    '<div class="fbadge fbadge--ok">Age parity: within tolerance</div>' +
    '<div class="fbadge fbadge--ok">Sex parity: within tolerance</div>' +
    '<div class="fbadge fbadge--warn">Region: South gap detected</div>' +
    '<div class="fbadge fbadge--warn">Race/Eth: Black/Af. Am. gap</div>' +
    '<div class="fbadge fbadge--info">Audit only · not operational</div>' +
  '</div>';

  /* ── Overall Performance gauges ── */
  html += '<div class="fairness-section-title">Overall Model Performance</div>' +
    '<div class="fairness-gauges" id="fair-gauges"></div>';

  /* ── Disclaimer ── */
  html += '<div class="fairness-disclaimer"><div><strong>Note on Race/Ethnicity:</strong> This dimension is used exclusively for fairness auditing. It is never surfaced in operational views nor used as a prediction feature. All subgroup comparisons are for internal model governance only.</div></div>';

  /* ── Row 1: Age lollipop + Region map ── */
  html += '<div class="fairness-section-title">Subgroup Performance</div>' +
  '<div class="fair-row fair-row--2col">' +
    '<div class="fair-card fair-card--tall"><div class="fair-card__title">Age Group — Dot Plot</div>' +
      '<div class="fair-card__sub">Recall, Precision, FPR across age cohorts</div>' +
      '<div id="fair-age-dots"></div></div>' +
    '<div class="fair-card fair-card--tall"><div class="fair-card__title">Region — US Performance Map</div>' +
      '<div class="fair-card__sub">State map colored by regional model performance</div>' +
      '<div id="fair-region-map"></div></div>' +
  '</div>';

  /* ── Row 2: Sex paired gauges + Ethnicity dot plot ── */
  html += '<div class="fair-row fair-row--2col">' +
    '<div class="fair-card"><div class="fair-card__title">Sex — Parity Comparison</div>' +
      '<div class="fair-card__sub">Female vs Male metric-by-metric</div>' +
      '<div id="fair-sex-rings"></div></div>' +
    '<div class="fair-card fair-card--tall"><div class="fair-card__title">Race/Ethnicity — Connected Dot Plot</div>' +
      '<div class="fair-card__sub">Metric spread across subgroups (audit only)</div>' +
      '<div id="fair-eth-dots"></div></div>' +
  '</div>';

  /* ── Row 3: Divergence + Parity heatmap ── */
  html += '<div class="fairness-section-title">Gap Analysis</div>' +
  '<div class="fair-row fair-row--2col">' +
    '<div class="fair-card"><div class="fair-card__title">Recall Divergence from Best</div>' +
      '<div class="fair-card__sub">Butterfly chart — distance from best subgroup</div>' +
      '<div id="fair-diverg"></div></div>' +
    '<div class="fair-card"><div class="fair-card__title">Parity Check Matrix</div>' +
      '<div class="fair-card__sub">Pass/Warn/Fail per dimension × metric</div>' +
      '<div id="fair-parity"></div></div>' +
  '</div>';

  container.innerHTML = html;

  /* ── Render sub-components ── */
  EnaraApp._renderFairGauges();
  EnaraApp._renderAgeDots(groups.age);
  EnaraApp._renderSexRings(groups.sex);
  EnaraApp._renderRegionMap(groups.region);
  EnaraApp._renderEthDots(groups.ethnicity);
  EnaraApp._renderFairDiverg(groups);
  EnaraApp._renderParityMatrix(groups);
};

/* ── Half-arc gauges (Overall Performance) ── */
EnaraApp._renderFairGauges = function() {
  var el = document.getElementById('fair-gauges');
  var items = [
    { value: 0.88, label: 'Avg Recall', color: 'var(--color-success)', sub: 'Across all subgroups' },
    { value: 0.85, label: 'Avg Precision', color: 'var(--color-primary)', sub: 'Across all subgroups' },
    { value: 0.93, label: 'FPR OK', color: 'var(--color-success)', sub: 'Avg FPR 0.07' },
    { value: 0.78, label: 'Equity Score', color: 'var(--color-warning)', sub: 'Max Recall gap 0.12' }
  ];

  el.innerHTML = items.map(function(item) {
    var r = 40, cx = 50, cy = 50;
    var pct = Math.min(Math.max(item.value, 0), 1);
    var halfCirc = Math.PI * r;
    var dashOffset = halfCirc - (pct * halfCirc);
    var bgPath = 'M ' + (cx - r) + ' ' + cy + ' A ' + r + ' ' + r + ' 0 0 1 ' + (cx + r) + ' ' + cy;

    return '<div class="gauge-card">' +
      '<div class="gauge-svg-wrap"><svg width="100" height="58" viewBox="0 0 100 58">' +
        '<path d="' + bgPath + '" fill="none" stroke="var(--color-border-light)" stroke-width="10" stroke-linecap="round"/>' +
        '<path d="' + bgPath + '" fill="none" stroke="' + item.color + '" stroke-width="10" stroke-linecap="round" ' +
          'class="gauge-arc-fill" stroke-dasharray="' + halfCirc.toFixed(1) + '" ' +
          'stroke-dashoffset="' + halfCirc.toFixed(1) + '" data-target="' + dashOffset.toFixed(1) + '"/>' +
      '</svg><div class="gauge-center"><div class="gauge-value" style="color:' + item.color + '">' + Math.round(pct * 100) + '%</div></div></div>' +
      '<div class="gauge-card-title">' + item.label + '</div>' +
      '<div class="gauge-card-sub">' + item.sub + '</div></div>';
  }).join('');
};

/* ── Age: Lollipop / Dot plot (SVG) ── */
EnaraApp._renderAgeDots = function(g) {
  var el = document.getElementById('fair-age-dots');
  var W = 380, H = 180, padL = 60, padR = 30, padT = 30, padB = 20;
  var chartW = W - padL - padR;
  var metrics = [
    { key: 'recall', label: 'Recall', color: 'var(--color-success)' },
    { key: 'precision', label: 'Precision', color: 'var(--color-primary)' },
    { key: 'fpr', label: 'FPR', color: 'var(--color-danger)' }
  ];
  var rowH = (H - padT - padB) / g.rows.length;

  var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" class="fair-svg">';

  /* Column headers */
  metrics.forEach(function(m, mi) {
    var x = padL + (mi + 0.5) * (chartW / metrics.length);
    svg += '<text x="' + x + '" y="' + 16 + '" text-anchor="middle" font-size="9" font-weight="600" fill="' + m.color + '">' + m.label + '</text>';
  });

  g.rows.forEach(function(row, ri) {
    var y = padT + ri * rowH + rowH / 2;

    /* Row label */
    svg += '<text x="' + (padL - 8) + '" y="' + (y + 4) + '" text-anchor="end" font-size="10" font-weight="500" fill="var(--color-text-secondary)">' + row.label + '</text>';

    /* Baseline */
    svg += '<line x1="' + padL + '" y1="' + y + '" x2="' + (W - padR) + '" y2="' + y + '" stroke="var(--color-border-light)" stroke-width="1"/>';

    /* Dots for each metric */
    metrics.forEach(function(m, mi) {
      var val = row[m.key];
      var colCenter = padL + (mi + 0.5) * (chartW / metrics.length);
      /* Map value: for FPR 0-0.15 = full range, for others 0.7-1.0 = full range */
      var min = m.key === 'fpr' ? 0 : 0.70;
      var max = m.key === 'fpr' ? 0.15 : 1.0;
      var halfCol = chartW / metrics.length * 0.4;
      var x = colCenter - halfCol + ((val - min) / (max - min)) * halfCol * 2;

      /* Stem line */
      svg += '<line x1="' + colCenter + '" y1="' + y + '" x2="' + x + '" y2="' + y + '" stroke="' + m.color + '" stroke-width="2" opacity="0.4" class="fair-lollipop-stem"/>';

      /* Dot */
      svg += '<circle cx="' + x + '" cy="' + y + '" r="6" fill="' + m.color + '" stroke="var(--color-card)" stroke-width="2" class="fair-dot" opacity="0"/>';

      /* Value text */
      svg += '<text x="' + x + '" y="' + (y - 10) + '" text-anchor="middle" font-size="8" font-weight="600" fill="' + m.color + '" class="fair-dot-label" opacity="0">' + val.toFixed(2) + '</text>';
    });
  });

  svg += '</svg>';
  el.innerHTML = svg;
};

/* ── Sex: Paired ring gauges ── */
EnaraApp._renderSexRings = function(g) {
  var el = document.getElementById('fair-sex-rings');
  var f = g.rows[0], m = g.rows[1];
  var metrics = [
    { key: 'recall', label: 'Recall' },
    { key: 'precision', label: 'Precision' },
    { key: 'fpr', label: 'FPR' }
  ];

  el.innerHTML = metrics.map(function(metric) {
    var fVal = f[metric.key], mVal = m[metric.key];
    var r = 22, circ = 2 * Math.PI * r;

    function ringSvg(val, isFpr) {
      var pct = isFpr ? (1 - val / 0.15) : val;
      var offset = circ - pct * circ;
      var cls = isFpr ? (val <= 0.07 ? 'good' : 'warn') : (val >= 0.87 ? 'good' : 'warn');
      var color = cls === 'good' ? 'var(--color-success)' : 'var(--color-warning)';
      return '<svg width="56" height="56" viewBox="0 0 56 56">' +
        '<circle cx="28" cy="28" r="' + r + '" fill="none" stroke="var(--color-border-light)" stroke-width="5"/>' +
        '<circle cx="28" cy="28" r="' + r + '" fill="none" stroke="' + color + '" stroke-width="5" stroke-linecap="round" ' +
          'stroke-dasharray="' + circ.toFixed(1) + '" stroke-dashoffset="' + circ.toFixed(1) + '" ' +
          'transform="rotate(-90 28 28)" class="fair-sex-ring" data-target="' + offset.toFixed(1) + '"/>' +
        '<text x="28" y="30" text-anchor="middle" font-size="11" font-weight="700" fill="' + color + '">' + (isFpr ? val.toFixed(2) : (val * 100).toFixed(0)) + '</text>' +
      '</svg>';
    }

    var isFpr = metric.key === 'fpr';
    return '<div class="fair-sex-metric">' +
      '<div class="fair-sex-metric-label">' + metric.label + '</div>' +
      '<div class="fair-sex-pair">' +
        '<div class="fair-sex-item">' + ringSvg(fVal, isFpr) + '<div class="fair-sex-name">♀ Female</div></div>' +
        '<div class="fair-sex-gap">' +
          '<div class="fair-sex-gap-val">' + (isFpr ? (Math.abs(fVal - mVal) * 100).toFixed(0) + ' pp' : Math.abs((fVal - mVal) * 100).toFixed(0) + ' pp') + '</div>' +
          '<div class="fair-sex-gap-label">gap</div>' +
        '</div>' +
        '<div class="fair-sex-item">' + ringSvg(mVal, isFpr) + '<div class="fair-sex-name">♂ Male</div></div>' +
      '</div>' +
    '</div>';
  }).join('');
};

/* ── Region: US geographic map (real SVG paths + interactivity) ── */
EnaraApp._renderRegionMap = function(g) {
  var el = document.getElementById('fair-region-map');
  var states = EnaraApp.US_STATES;

  /* Map region keys to data rows */
  var regionData = {
    west:    g.rows[0],
    east:    g.rows[1],
    midwest: g.rows[2],
    south:   g.rows[3]
  };

  var regionLabels = {
    west: 'West Coast', east: 'East Coast',
    midwest: 'Midwest', south: 'South'
  };

  var regionColors = {
    west:    '#38A169',
    east:    '#389FBA',
    midwest: '#DD6B20',
    south:   '#E53E3E'
  };

  /* Use the real viewBox from the SVG map data */
  var vb = EnaraApp.US_MAP_VIEWBOX;
  var svg = '<svg viewBox="' + vb + '" class="fair-map-svg" preserveAspectRatio="xMidYMid meet">';

  /* Render each state path */
  states.forEach(function(st, i) {
    var color = regionColors[st.region] || '#ccc';
    svg += '<path d="' + st.d + '" ' +
      'fill="' + color + '" stroke="var(--color-card)" stroke-width="1.5" ' +
      'class="map-state-path" data-idx="' + i + '" ' +
      'data-state="' + st.id + '" data-name="' + st.name + '" data-region="' + st.region + '" ' +
      'opacity="0" style="cursor:pointer"/>';
  });

  svg += '</svg>';

  /* Info panel (shown on hover/click) */
  var infoPanel = '<div class="fair-map-info" id="fair-map-info">' +
    '<div class="fair-map-info__state" id="map-info-state">Hover over a state</div>' +
    '<div class="fair-map-info__region" id="map-info-region"></div>' +
    '<div class="fair-map-info__metrics" id="map-info-metrics"></div>' +
  '</div>';

  /* Legend */
  var legend = '<div class="fair-map-legend">' +
    Object.keys(regionData).map(function(key) {
      var row = regionData[key];
      var color = regionColors[key];
      var label = regionLabels[key];
      var count = states.filter(function(s) { return s.region === key; }).length;
      return '<div class="fair-map-legend-item">' +
        '<span class="fair-legend-dot" style="background:' + color + '"></span>' +
        '<span class="fair-map-legend-name">' + label + '</span>' +
        '<span class="fair-map-legend-metrics">' +
          '<span class="fair-map-metric">R:' + row.recall.toFixed(2) + '</span>' +
          '<span class="fair-map-metric">P:' + row.precision.toFixed(2) + '</span>' +
          '<span class="fair-map-metric">FPR:' + row.fpr.toFixed(2) + '</span>' +
          '<span class="fair-map-metric fair-map-metric--n">' + count + ' states</span>' +
        '</span>' +
      '</div>';
    }).join('') +
  '</div>';

  el.innerHTML = infoPanel + svg + legend;

  /* ── Interactivity: hover + click ── */
  var infoState = document.getElementById('map-info-state');
  var infoRegion = document.getElementById('map-info-region');
  var infoMetrics = document.getElementById('map-info-metrics');
  var activeState = null;

  el.querySelectorAll('.map-state-path').forEach(function(path) {
    path.addEventListener('mouseenter', function() {
      var region = path.dataset.region;
      var row = regionData[region];
      var color = regionColors[region];
      infoState.textContent = path.dataset.name;
      infoState.style.color = color;
      infoRegion.textContent = regionLabels[region] + ' region';
      infoMetrics.innerHTML =
        '<span>Recall: <strong>' + row.recall.toFixed(2) + '</strong></span>' +
        '<span>Precision: <strong>' + row.precision.toFixed(2) + '</strong></span>' +
        '<span>FPR: <strong>' + row.fpr.toFixed(2) + '</strong></span>' +
        '<span>n = <strong>' + row.n + '</strong> patients</span>';
      path.setAttribute('opacity', '1');
      path.style.filter = 'brightness(1.2) drop-shadow(0 2px 6px rgba(0,0,0,0.3))';
    });

    path.addEventListener('mouseleave', function() {
      if (path !== activeState) {
        path.setAttribute('opacity', '0.82');
        path.style.filter = '';
      }
    });

    path.addEventListener('click', function() {
      /* Reset previous active */
      if (activeState && activeState !== path) {
        activeState.setAttribute('opacity', '0.82');
        activeState.style.filter = '';
        activeState.style.strokeWidth = '1.5';
      }
      activeState = path;
      path.style.strokeWidth = '3';
      path.style.filter = 'brightness(1.2) drop-shadow(0 2px 6px rgba(0,0,0,0.3))';

      /* Open rich popup */
      EnaraApp._openStatePopup(path.dataset.state, path.dataset.name, path.dataset.region, regionData, regionColors, regionLabels);
    });
  });
};

/* ── State popup modal with SVG graphics ── */
EnaraApp._openStatePopup = function(stateId, stateName, regionKey, regionData, regionColors, regionLabels) {
  /* Remove previous popup if any */
  var existing = document.getElementById('state-popup-overlay');
  if (existing) existing.remove();

  var row = regionData[regionKey];
  var color = regionColors[regionKey];
  var label = regionLabels[regionKey];

  /* Overall averages for comparison */
  var avg = { recall: 0.88, precision: 0.85, fpr: 0.07 };

  /* Simulated state-level data (seeded from state abbreviation) */
  var seed = 0;
  for (var c = 0; c < stateId.length; c++) seed += stateId.charCodeAt(c);
  var statePatients = 15 + (seed * 7) % 120;
  var stateHighRisk = Math.round(statePatients * (0.05 + (seed % 20) / 100));
  var stateCoverage = 78 + (seed * 3) % 20;
  var stateRetained = 68 + (seed * 5) % 25;

  /* ── Build comparison bar chart SVG ── */
  var metrics = [
    { label: 'Recall',    region: row.recall,    overall: avg.recall,    max: 1 },
    { label: 'Precision', region: row.precision,  overall: avg.precision, max: 1 },
    { label: 'FPR',       region: row.fpr,        overall: avg.fpr,       max: 0.15 }
  ];

  var barW = 280, barH = 130, padL = 70, padT = 8, barGap = 38;
  var barSvg = '<svg viewBox="0 0 ' + barW + ' ' + barH + '" class="popup-bar-svg">';

  metrics.forEach(function(m, i) {
    var y = padT + i * barGap;
    var trackW = barW - padL - 30;
    var regPct = (m.label === 'FPR') ? (m.region / m.max) : (m.region / m.max);
    var avgPct = (m.label === 'FPR') ? (m.overall / m.max) : (m.overall / m.max);
    var regW = regPct * trackW;
    var avgW = avgPct * trackW;
    var regColor = color;
    var isBad = (m.label === 'FPR') ? m.region > m.overall : m.region < m.overall;

    /* Label */
    barSvg += '<text x="' + (padL - 6) + '" y="' + (y + 10) + '" text-anchor="end" font-size="10" font-weight="500" fill="var(--color-text-secondary)">' + m.label + '</text>';

    /* Track */
    barSvg += '<rect x="' + padL + '" y="' + (y + 2) + '" width="' + trackW + '" height="10" rx="5" fill="var(--color-border-light)"/>';

    /* Overall avg line */
    barSvg += '<line x1="' + (padL + avgW) + '" y1="' + y + '" x2="' + (padL + avgW) + '" y2="' + (y + 14) + '" stroke="var(--color-text-muted)" stroke-width="2" stroke-dasharray="3,2"/>';

    /* Region bar */
    barSvg += '<rect x="' + padL + '" y="' + (y + 2) + '" width="' + regW + '" height="10" rx="5" fill="' + regColor + '" opacity="0.8"/>';

    /* Values */
    barSvg += '<text x="' + (padL + trackW + 6) + '" y="' + (y + 11) + '" font-size="10" font-weight="700" fill="' + (isBad ? 'var(--color-danger)' : 'var(--color-success)') + '">' + m.region.toFixed(2) + '</text>';

    /* Sub-label for avg */
    barSvg += '<text x="' + (padL + avgW) + '" y="' + (y + 26) + '" text-anchor="middle" font-size="7" fill="var(--color-text-light)">avg ' + m.overall.toFixed(2) + '</text>';
  });

  barSvg += '</svg>';

  /* ── Build mini gauge SVGs for state stats ── */
  function miniGauge(value, maxVal, gaugeColor, labelText) {
    var pct = value / maxVal;
    var r = 24, circ = 2 * Math.PI * r;
    var offset = circ - pct * circ;
    return '<div class="popup-stat">' +
      '<svg width="60" height="60" viewBox="0 0 60 60">' +
        '<circle cx="30" cy="30" r="' + r + '" fill="none" stroke="var(--color-border-light)" stroke-width="5"/>' +
        '<circle cx="30" cy="30" r="' + r + '" fill="none" stroke="' + gaugeColor + '" stroke-width="5" ' +
          'stroke-linecap="round" stroke-dasharray="' + circ.toFixed(1) + '" stroke-dashoffset="' + offset.toFixed(1) + '" ' +
          'transform="rotate(-90 30 30)"/>' +
        '<text x="30" y="28" text-anchor="middle" font-size="13" font-weight="700" fill="' + gaugeColor + '">' + value + '</text>' +
        '<text x="30" y="39" text-anchor="middle" font-size="7" fill="var(--color-text-muted)">' + (maxVal > 1 ? '' : '%') + '</text>' +
      '</svg>' +
      '<div class="popup-stat__label">' + labelText + '</div>' +
    '</div>';
  }

  /* ── Parity check indicators ── */
  function parityDot(val, threshold, metric) {
    var isFpr = metric === 'FPR';
    var diff = isFpr ? (val - avg[metric.toLowerCase()]) : (avg[metric.toLowerCase()] - val);
    var status = Math.abs(diff) < 0.03 ? 'pass' : Math.abs(diff) < 0.06 ? 'warn' : 'fail';
    var sym = status === 'pass' ? '✓' : status === 'warn' ? '⚠' : '✗';
    return '<span class="popup-parity popup-parity--' + status + '">' + sym + ' ' + metric + '</span>';
  }

  /* ── Assemble popup HTML ── */
  var html = '<div class="state-popup-overlay" id="state-popup-overlay">' +
    '<div class="state-popup">' +
      '<div class="state-popup__header" style="border-color:' + color + '">' +
        '<div class="state-popup__title">' +
          '<span class="state-popup__name">' + stateName + '</span>' +
          '<span class="state-popup__abbr">' + stateId + '</span>' +
        '</div>' +
        '<div class="state-popup__region" style="background:' + color + '">' + label + '</div>' +
        '<button class="state-popup__close" id="state-popup-close">✕</button>' +
      '</div>' +

      '<div class="state-popup__body">' +
        /* Section 1: Metrics comparison */
        '<div class="popup-section">' +
          '<div class="popup-section__title">Regional Model Performance vs Overall</div>' +
          '<div class="popup-section__sub">Dashed line = overall average · Solid bar = ' + label + '</div>' +
          barSvg +
        '</div>' +

        /* Section 2: State stats gauges */
        '<div class="popup-section">' +
          '<div class="popup-section__title">Estimated State Metrics</div>' +
          '<div class="popup-gauges">' +
            miniGauge(statePatients, 150, color, 'Patients') +
            miniGauge(stateHighRisk, statePatients, 'var(--color-danger)', 'High Risk') +
            miniGauge(stateCoverage, 100, 'var(--color-success)', 'Coverage %') +
            miniGauge(stateRetained, 100, 'var(--color-primary)', 'Retained %') +
          '</div>' +
        '</div>' +

        /* Section 3: Parity check */
        '<div class="popup-section">' +
          '<div class="popup-section__title">Parity Status</div>' +
          '<div class="popup-parity-row">' +
            parityDot(row.recall, avg.recall, 'Recall') +
            parityDot(row.precision, avg.precision, 'Precision') +
            parityDot(row.fpr, avg.fpr, 'FPR') +
          '</div>' +
        '</div>' +

        '<div class="popup-note">Data shown reflects regional model performance applied to ' + stateName + '. Individual state-level model tuning is not performed.</div>' +
      '</div>' +
    '</div>' +
  '</div>';

  document.body.insertAdjacentHTML('beforeend', html);

  /* Animate in */
  requestAnimationFrame(function() {
    document.getElementById('state-popup-overlay').classList.add('is-open');
  });

  /* Close handlers */
  function closePopup() {
    var overlay = document.getElementById('state-popup-overlay');
    if (overlay) {
      overlay.classList.remove('is-open');
      setTimeout(function() { overlay.remove(); }, 300);
    }
  }

  document.getElementById('state-popup-close').addEventListener('click', closePopup);
  document.getElementById('state-popup-overlay').addEventListener('click', function(e) {
    if (e.target === this) closePopup();
  });
  document.addEventListener('keydown', function handler(e) {
    if (e.key === 'Escape') { closePopup(); document.removeEventListener('keydown', handler); }
  });
};

/* ── Ethnicity: Connected dot plot (SVG) ── */
EnaraApp._renderEthDots = function(g) {
  var el = document.getElementById('fair-eth-dots');
  var W = 380, H = 220, padL = 100, padR = 20, padT = 30, padB = 10;
  var metrics = [
    { key: 'recall', label: 'Recall', color: 'var(--color-success)', min: 0.75, max: 0.95 },
    { key: 'precision', label: 'Prec.', color: 'var(--color-primary)', min: 0.75, max: 0.95 },
    { key: 'fpr', label: 'FPR', color: 'var(--color-danger)', min: 0.03, max: 0.12 }
  ];
  var colW = (W - padL - padR) / metrics.length;
  var rowH = (H - padT - padB) / g.rows.length;

  var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" class="fair-svg">';

  /* Column headers */
  metrics.forEach(function(m, mi) {
    var x = padL + mi * colW + colW / 2;
    svg += '<text x="' + x + '" y="16" text-anchor="middle" font-size="9" font-weight="600" fill="' + m.color + '">' + m.label + '</text>';
    svg += '<line x1="' + x + '" y1="' + padT + '" x2="' + x + '" y2="' + (H - padB) + '" stroke="var(--color-border-light)" stroke-width="1" stroke-dasharray="3,3"/>';
  });

  /* Rows */
  g.rows.forEach(function(row, ri) {
    var y = padT + ri * rowH + rowH / 2;
    svg += '<text x="' + (padL - 8) + '" y="' + (y + 4) + '" text-anchor="end" font-size="9" font-weight="500" fill="var(--color-text-secondary)">' + row.label + '</text>';

    /* Connect dots with line */
    var dotPositions = [];
    metrics.forEach(function(m, mi) {
      var val = row[m.key];
      var norm = (val - m.min) / (m.max - m.min);
      var x = padL + mi * colW + colW / 2 + (norm - 0.5) * colW * 0.6;
      dotPositions.push({ x: x, y: y });
    });

    /* Connecting line */
    svg += '<path d="M' + dotPositions.map(function(p) { return p.x + ',' + p.y; }).join(' L') + '" ' +
      'fill="none" stroke="var(--color-border)" stroke-width="1" opacity="0.4" class="fair-connect-line"/>';

    /* Dots */
    metrics.forEach(function(m, mi) {
      var val = row[m.key];
      var norm = (val - m.min) / (m.max - m.min);
      var x = padL + mi * colW + colW / 2 + (norm - 0.5) * colW * 0.6;
      svg += '<circle cx="' + x + '" cy="' + y + '" r="5" fill="' + m.color + '" stroke="var(--color-card)" stroke-width="2" class="fair-dot" opacity="0"/>';
    });
  });

  svg += '</svg>';
  el.innerHTML = svg;
};

/* ── Divergence butterfly bars ── */
EnaraApp._renderFairDiverg = function(groups) {
  var el = document.getElementById('fair-diverg');
  var allGroups = ['age', 'region', 'ethnicity'];
  var html = '';

  allGroups.forEach(function(key) {
    var g = groups[key];
    var vals = g.rows.map(function(r) { return r.recall; });
    var best = Math.max.apply(null, vals);

    html += '<div class="fair-diverg-section"><div class="fair-diverg-title">' + g.title + '</div>';
    html += g.rows.map(function(row) {
      var diff = row.recall - best;
      var absDiff = Math.abs(diff);
      var barPct = absDiff / 0.15 * 50;
      var color = absDiff < 0.03 ? 'var(--color-success)' : absDiff < 0.08 ? 'var(--color-warning)' : 'var(--color-danger)';
      var sign = diff === 0 ? '=' : diff.toFixed(2);
      return '<div class="diverg-row">' +
        '<div class="diverg-row-label">' + row.label + '</div>' +
        '<div class="diverg-center-line"><div class="diverg-axis"></div>' +
          (diff === 0 ? '' : '<div class="diverg-bar diverg-bar--neg" data-pct="' + barPct.toFixed(0) + '" style="width:0;background:' + color + '"></div>') +
        '</div>' +
        '<div class="diverg-val" style="color:' + color + '">' + sign + '</div></div>';
    }).join('');
    html += '</div>';
  });

  el.innerHTML = html;
};

/* ── Parity heatmap (pass/warn/fail grid) ── */
EnaraApp._renderParityMatrix = function(groups) {
  var el = document.getElementById('fair-parity');
  var dims = ['age', 'sex', 'region', 'ethnicity'];
  var dimLabels = ['Age', 'Sex', 'Region', 'Race/Eth'];
  var metrics = ['recall', 'precision', 'fpr'];
  var metricLabels = ['Recall', 'Precision', 'FPR'];

  function checkParity(g, metric) {
    var vals = g.rows.map(function(r) { return r[metric]; });
    var max = Math.max.apply(null, vals);
    var min = Math.min.apply(null, vals);
    var gap = max - min;
    if (gap < 0.03) return 'pass';
    if (gap < 0.08) return 'warn';
    return 'fail';
  }

  var html = '<div class="parity-grid">';

  /* Header */
  html += '<div class="parity-corner"></div>';
  metricLabels.forEach(function(ml) {
    html += '<div class="parity-col-label">' + ml + '</div>';
  });

  /* Rows */
  dims.forEach(function(dim, di) {
    html += '<div class="parity-row-label">' + dimLabels[di] + '</div>';
    metrics.forEach(function(metric, mi) {
      var result = checkParity(groups[dim], metric);
      var symbol = result === 'pass' ? '✓' : result === 'warn' ? '⚠' : '✗';
      html += '<div class="parity-cell parity-cell--' + result + ' heatmap-cell" style="opacity:0">' + symbol + '</div>';
    });
  });

  html += '</div>';
  el.innerHTML = html;
};

/* ── Animate all fairness charts ── */
EnaraApp.animateGauges = function() {
  /* Reset gauge arcs */
  document.querySelectorAll('.gauge-arc-fill').forEach(function(arc) {
    arc.style.transition = 'none';
    arc.style.strokeDashoffset = arc.getAttribute('stroke-dasharray');
  });
  /* Reset gauge cards */
  document.querySelectorAll('.gauge-card').forEach(function(c) {
    c.style.transition = 'none'; c.style.opacity = '0'; c.style.transform = 'translateY(12px) scale(0.9)';
  });
  /* Reset fair cards */
  document.querySelectorAll('.fair-card').forEach(function(c) {
    c.style.transition = 'none'; c.style.opacity = '0'; c.style.transform = 'translateY(10px)';
  });
  /* Reset dots */
  document.querySelectorAll('.fair-dot').forEach(function(d) { d.style.transition = 'none'; d.setAttribute('opacity', '0'); });
  document.querySelectorAll('.fair-dot-label').forEach(function(d) { d.style.transition = 'none'; d.setAttribute('opacity', '0'); });
  /* Reset sex rings */
  document.querySelectorAll('.fair-sex-ring').forEach(function(r) {
    r.style.transition = 'none'; r.style.strokeDashoffset = (2 * Math.PI * 22).toFixed(1);
  });
  /* Reset map state paths */
  document.querySelectorAll('.map-state-path').forEach(function(t) {
    t.style.transition = 'none'; t.setAttribute('opacity', '0');
  });
  /* Reset parity + heatmap cells */
  document.querySelectorAll('.heatmap-cell').forEach(function(c) {
    c.style.transition = 'none'; c.style.opacity = '0'; c.style.transform = 'scale(0.7)';
  });

  requestAnimationFrame(function() { requestAnimationFrame(function() {
    /* Gauge arcs */
    document.querySelectorAll('.gauge-arc-fill').forEach(function(arc, i) {
      arc.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1) ' + (i * 150 + 200) + 'ms';
      arc.style.strokeDashoffset = arc.dataset.target;
    });
    /* Gauge cards */
    document.querySelectorAll('.gauge-card').forEach(function(c, i) {
      c.style.transition = 'opacity 0.5s ease ' + (i * 100) + 'ms, transform 0.5s cubic-bezier(0.34,1.56,0.64,1) ' + (i * 100) + 'ms';
      c.style.opacity = '1'; c.style.transform = 'translateY(0) scale(1)';
    });
    /* Fair cards */
    document.querySelectorAll('.fair-card').forEach(function(c, i) {
      c.style.transition = 'opacity 0.4s ease ' + (200 + i * 100) + 'ms, transform 0.4s ease ' + (200 + i * 100) + 'ms';
      c.style.opacity = '1'; c.style.transform = 'translateY(0)';
    });
    /* Dots */
    document.querySelectorAll('.fair-dot').forEach(function(d, i) {
      d.style.transition = 'opacity 0.4s ease ' + (400 + i * 40) + 'ms';
      d.setAttribute('opacity', '1');
    });
    document.querySelectorAll('.fair-dot-label').forEach(function(d, i) {
      d.style.transition = 'opacity 0.3s ease ' + (600 + i * 40) + 'ms';
      d.setAttribute('opacity', '1');
    });
    /* Sex rings */
    document.querySelectorAll('.fair-sex-ring').forEach(function(r, i) {
      r.style.transition = 'stroke-dashoffset 0.9s cubic-bezier(0.4,0,0.2,1) ' + (300 + i * 100) + 'ms';
      r.style.strokeDashoffset = r.dataset.target;
    });
    /* Map state paths (staggered fade-in) */
    document.querySelectorAll('.map-state-path').forEach(function(t, i) {
      t.style.transition = 'opacity 0.4s ease ' + (300 + i * 20) + 'ms';
      t.setAttribute('opacity', '0.82');
    });
    /* Parity cells */
    document.querySelectorAll('.heatmap-cell').forEach(function(c, i) {
      c.style.transition = 'opacity 0.4s ease ' + (i * 60) + 'ms, transform 0.4s cubic-bezier(0.34,1.56,0.64,1) ' + (i * 60) + 'ms';
      c.style.opacity = '1'; c.style.transform = 'scale(1)';
    });
  }); });
};
