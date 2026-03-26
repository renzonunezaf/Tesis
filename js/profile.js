/**
 * ==========================================================
 * PROFILE MODULE
 * Patient profile view with interactive weight trajectory
 * SVG chart, appointment timeline, engagement gauges, and
 * SHAP explanation.
 * ==========================================================
 */

/* ── Open patient profile ── */
EnaraApp.openProfile = function(patientId) {
  var p = EnaraApp.PATIENTS.find(function(x) { return x.id === patientId; });
  if (!p) return;

  EnaraApp.closeDrawer();
  EnaraApp.state.profilePatientId = patientId;

  var riskColor = EnaraApp.getRiskColor(p.risk);
  var sexLabel = p.sex === 'F' ? 'Female' : 'Male';
  var riskBadge = EnaraApp.RISK_BADGE_CLASS[p.riskLevel];
  var statusBadge = EnaraApp.STATUS_BADGE_CLASS[p.status] || '';

  var el = document.getElementById('view-profile');

  /* ── Build HTML ── */
  var html = '';

  /* Back button */
  html += '<button class="profile-back" onclick="EnaraApp.switchView(\'operations\')">' +
    '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11L5 7l4-4"/></svg>' +
    'Back to Dashboard</button>';

  /* Hero card */
  html += '<div class="profile-hero">' +
    '<div class="profile-hero__left">' +
      '<div class="profile-hero__avatar" style="background:' + riskColor + '">' + p.initials + '</div>' +
      '<div class="profile-hero__info">' +
        '<div class="profile-hero__name">' + p.name + '</div>' +
        '<div class="profile-hero__id">' + p.id + ' · ' + p.age + 'y/o ' + sexLabel + ' · ' + p.state + '</div>' +
        '<div class="profile-hero__badges">' +
          '<span class="badge ' + riskBadge + '">' + p.riskLevel + ' Risk</span>' +
          '<span class="badge ' + statusBadge + '">' + p.status + '</span>' +
          '<span class="badge badge--outline">' + p.medTrack + '</span>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div class="profile-hero__right">' +
      EnaraApp._buildProfileGauge(p.risk, riskColor, 'Risk Score') +
    '</div>' +
  '</div>';

  /* Detail pills */
  html += '<div class="profile-details">' +
    EnaraApp._profilePill('Insurer', p.insurer) +
    EnaraApp._profilePill('Clinic', p.clinic) +
    EnaraApp._profilePill('Modality', p.modality) +
    EnaraApp._profilePill('Weeks', p.weeks + ' in program') +
    EnaraApp._profilePill('Engagement', p.engagement) +
    EnaraApp._profilePill('Assigned', p.owner) +
    EnaraApp._profilePill('Last Appt', p.lastAppt) +
    EnaraApp._profilePill('Dropout Window', '~' + p.dropoutWindow + ' days') +
  '</div>';

  /* Grid: Weight chart + Engagement */
  html += '<div class="profile-grid">';

  /* Weight trajectory */
  html += '<div class="profile-card profile-grid--full">' +
    '<div class="profile-card__header">' +
      '<div class="profile-card__title">' +
        '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12 L5 8 L8 10 L11 5 L14 7"/></svg>' +
        'Weight Trajectory' +
      '</div>' +
      '<div class="profile-card__badge" id="profile-weight-delta"></div>' +
    '</div>' +
    '<div class="weight-chart" id="profile-weight-chart">' +
      '<div class="chart-tooltip" id="weight-tooltip"></div>' +
    '</div>' +
  '</div>';

  /* Engagement metrics */
  html += '<div class="profile-card">' +
    '<div class="profile-card__header">' +
      '<div class="profile-card__title">' +
        '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 1v14M1 8h14"/><circle cx="8" cy="8" r="6"/></svg>' +
        'Engagement Metrics' +
      '</div>' +
    '</div>' +
    '<div class="engage-grid" id="profile-engage-grid"></div>' +
  '</div>';

  /* Appointment timeline */
  html += '<div class="profile-card">' +
    '<div class="profile-card__header">' +
      '<div class="profile-card__title">' +
        '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="2.5" width="14" height="11.5" rx="1.5"/><path d="M1 6h14M5 1v3M11 1v3"/></svg>' +
        'Appointment History' +
      '</div>' +
      '<div class="profile-card__badge" id="profile-appt-count"></div>' +
    '</div>' +
    '<div class="timeline" id="profile-timeline"></div>' +
  '</div>';

  html += '</div>'; /* /profile-grid */

  /* SHAP section (full width) */
  html += '<div class="profile-card" style="margin-bottom:var(--space-lg)">' +
    '<div class="profile-card__header">' +
      '<div class="profile-card__title">' +
        '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="2.5"/><circle cx="8" cy="8" r="6"/><path d="M8 2v2M8 12v2M2 8h2M12 8h2"/></svg>' +
        'SHAP Risk Explanation' +
      '</div>' +
    '</div>' +
    '<div class="shap-summary">' + p.summary + '</div>' +
    '<div id="profile-shap-bars"></div>' +
    '<div class="shap-note" style="margin-top:var(--space-md)">' +
      'These factors influenced the model prediction. Clinical judgment should always guide decisions.' +
    '</div>' +
  '</div>';

  el.innerHTML = html;

  /* ── Render sub-components ── */
  EnaraApp._renderWeightChart(patientId);
  EnaraApp._renderEngageGrid(patientId);
  EnaraApp._renderTimeline(patientId);
  EnaraApp._renderProfileShap(p);

  /* Switch to profile view */
  EnaraApp.switchView('profile');
};

/* ── Helper: profile pill ── */
EnaraApp._profilePill = function(label, value) {
  return '<div class="profile-pill"><span class="profile-pill__icon">' +
    '<svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><circle cx="5" cy="5" r="3"/></svg>' +
    '</span>' + label + ': <strong>' + value + '</strong></div>';
};

/* ── Helper: large risk gauge SVG ── */
EnaraApp._buildProfileGauge = function(risk, color, label) {
  var r = 38;
  var circ = 2 * Math.PI * r;
  var offset = circ - (risk / 100) * circ;
  return '<div class="profile-gauge">' +
    '<svg width="96" height="96" viewBox="0 0 96 96">' +
      '<circle cx="48" cy="48" r="' + r + '" fill="none" stroke="var(--color-border-light)" stroke-width="7"/>' +
      '<circle cx="48" cy="48" r="' + r + '" fill="none" stroke="' + color + '" stroke-width="7" ' +
        'stroke-linecap="round" stroke-dasharray="' + circ.toFixed(1) + '" ' +
        'stroke-dashoffset="' + circ.toFixed(1) + '" ' +
        'transform="rotate(-90 48 48)" class="profile-gauge__fill" ' +
        'data-target="' + offset.toFixed(1) + '"/>' +
      '<text x="48" y="44" text-anchor="middle" font-size="22" font-weight="700" fill="' + color + '">' + risk + '</text>' +
      '<text x="48" y="58" text-anchor="middle" font-size="9" fill="var(--color-text-muted)">%</text>' +
    '</svg>' +
    '<div class="profile-gauge__label">' + label + '</div>' +
  '</div>';
};

/* ── Weight trajectory SVG chart ── */
EnaraApp._renderWeightChart = function(patientId) {
  var wh = EnaraApp.WEIGHT_HISTORY[patientId];
  if (!wh || !wh.entries.length) return;

  var entries = wh.entries;
  var container = document.getElementById('profile-weight-chart');
  var tooltip = document.getElementById('weight-tooltip');

  var W = 680, H = 180;
  var padL = 44, padR = 20, padT = 20, padB = 30;
  var chartW = W - padL - padR;
  var chartH = H - padT - padB;

  var allVals = entries.map(function(e) { return e.value; }).concat([wh.goal]);
  var maxV = Math.max.apply(null, allVals) + 5;
  var minV = Math.min.apply(null, allVals) - 5;
  var maxWeek = entries[entries.length - 1].week;

  function xScale(week) { return padL + (week / Math.max(maxWeek, 1)) * chartW; }
  function yScale(val) { return padT + (1 - (val - minV) / (maxV - minV)) * chartH; }

  /* Points */
  var points = entries.map(function(e) {
    return { x: xScale(e.week), y: yScale(e.value), week: e.week, value: e.value };
  });

  /* SVG build */
  var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid meet">';

  /* Defs: gradient */
  svg += '<defs>' +
    '<linearGradient id="weightAreaGrad" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0%" stop-color="var(--color-primary)" stop-opacity="0.2"/>' +
      '<stop offset="100%" stop-color="var(--color-primary)" stop-opacity="0.01"/>' +
    '</linearGradient>' +
    '<linearGradient id="weightLineGrad" x1="0" y1="0" x2="1" y2="0">' +
      '<stop offset="0%" stop-color="var(--color-primary)"/>' +
      '<stop offset="100%" stop-color="var(--color-primary-dark)"/>' +
    '</linearGradient>' +
  '</defs>';

  /* Grid lines (horizontal) */
  var gridSteps = 5;
  for (var g = 0; g <= gridSteps; g++) {
    var gVal = minV + (g / gridSteps) * (maxV - minV);
    var gy = yScale(gVal);
    svg += '<line x1="' + padL + '" y1="' + gy + '" x2="' + (W - padR) + '" y2="' + gy + '" ' +
      'stroke="var(--color-border-light)" stroke-width="1"/>';
    svg += '<text x="' + (padL - 6) + '" y="' + (gy + 3) + '" text-anchor="end" ' +
      'font-size="9" fill="var(--color-text-light)">' + Math.round(gVal) + '</text>';
  }

  /* X axis labels */
  points.forEach(function(pt) {
    svg += '<text x="' + pt.x + '" y="' + (H - 6) + '" text-anchor="middle" ' +
      'font-size="9" fill="var(--color-text-light)">W' + pt.week + '</text>';
  });

  /* Goal line (dashed) */
  var goalY = yScale(wh.goal);
  svg += '<line x1="' + padL + '" y1="' + goalY + '" x2="' + (W - padR) + '" y2="' + goalY + '" ' +
    'stroke="var(--color-success)" stroke-width="1.5" stroke-dasharray="6,4" opacity="0.6"/>';
  svg += '<text x="' + (W - padR + 4) + '" y="' + (goalY + 3) + '" font-size="8" ' +
    'fill="var(--color-success)" font-weight="600">GOAL</text>';

  /* Start line (dashed) */
  var startY = yScale(wh.start);
  svg += '<line x1="' + padL + '" y1="' + startY + '" x2="' + (W - padR) + '" y2="' + startY + '" ' +
    'stroke="var(--color-text-light)" stroke-width="1" stroke-dasharray="4,4" opacity="0.4"/>';

  /* Area path */
  var linePath = 'M' + points.map(function(pt) { return pt.x + ',' + pt.y; }).join(' L');
  var areaPath = linePath + ' L' + points[points.length - 1].x + ',' + (padT + chartH) +
    ' L' + points[0].x + ',' + (padT + chartH) + ' Z';
  svg += '<path d="' + areaPath + '" fill="url(#weightAreaGrad)" class="weight-area"/>';

  /* Line path (animated) */
  svg += '<path d="' + linePath + '" fill="none" stroke="url(#weightLineGrad)" stroke-width="2.5" ' +
    'stroke-linecap="round" stroke-linejoin="round" id="weight-line-path" ' +
    'stroke-dasharray="1200" stroke-dashoffset="1200"/>';

  /* Crosshair (hidden, moved by JS) */
  svg += '<line id="weight-crosshair" x1="0" y1="' + padT + '" x2="0" y2="' + (padT + chartH) + '" ' +
    'stroke="var(--color-primary)" stroke-width="1" stroke-dasharray="3,3" opacity="0" />';

  /* Dots */
  points.forEach(function(pt, i) {
    var isFirst = (i === 0);
    var isLast = (i === points.length - 1);
    var dotColor = isLast ? 'var(--color-primary-dark)' : 'var(--color-primary)';
    var dotR = (isFirst || isLast) ? 5 : 3.5;
    svg += '<circle cx="' + pt.x + '" cy="' + pt.y + '" r="' + dotR + '" ' +
      'fill="' + dotColor + '" stroke="var(--color-card)" stroke-width="2" ' +
      'class="weight-dot" data-idx="' + i + '" ' +
      'style="opacity:0;transition:opacity 0.3s ease ' + (i * 60) + 'ms"/>';
  });

  /* Invisible hit areas for hover */
  points.forEach(function(pt, i) {
    svg += '<rect x="' + (pt.x - 16) + '" y="' + padT + '" width="32" height="' + chartH + '" ' +
      'fill="transparent" class="weight-hit" data-idx="' + i + '"/>';
  });

  svg += '</svg>';
  container.insertAdjacentHTML('afterbegin', svg);

  /* Delta badge */
  var startVal = entries[0].value;
  var endVal = entries[entries.length - 1].value;
  var delta = endVal - startVal;
  var pctDelta = ((delta / startVal) * 100).toFixed(1);
  var deltaEl = document.getElementById('profile-weight-delta');
  deltaEl.textContent = (delta <= 0 ? '' : '+') + delta + ' lb (' + pctDelta + '%)';
  if (delta <= 0) deltaEl.style.background = 'var(--color-success-light)';
  else deltaEl.style.background = 'var(--color-danger-light)';

  /* ── Animate line in ── */
  requestAnimationFrame(function() {
    var line = document.getElementById('weight-line-path');
    if (line) {
      requestAnimationFrame(function() {
        line.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)';
        line.style.strokeDashoffset = '0';
      });
    }
    /* Fade in dots */
    document.querySelectorAll('.weight-dot').forEach(function(dot) {
      dot.style.opacity = '1';
    });
  });

  /* ── Tooltip interactivity ── */
  var crosshair = document.getElementById('weight-crosshair');

  container.querySelectorAll('.weight-hit').forEach(function(hit) {
    hit.addEventListener('mouseenter', function() {
      var idx = parseInt(hit.dataset.idx, 10);
      var pt = points[idx];
      var entry = entries[idx];
      var prevVal = idx > 0 ? entries[idx - 1].value : null;
      var deltaText = prevVal !== null ? ((entry.value - prevVal > 0 ? '+' : '') + (entry.value - prevVal) + ' lb') : 'Start';

      crosshair.setAttribute('x1', pt.x);
      crosshair.setAttribute('x2', pt.x);
      crosshair.style.opacity = '0.5';

      tooltip.innerHTML =
        '<div class="chart-tooltip__value">' + entry.value + ' lb</div>' +
        '<div>Week ' + entry.week + '</div>' +
        '<div class="chart-tooltip__delta">' + deltaText + '</div>';
      tooltip.classList.add('is-visible');

      /* Position tooltip */
      var rect = container.getBoundingClientRect();
      var svgEl = container.querySelector('svg');
      var svgRect = svgEl.getBoundingClientRect();
      var scaleX = svgRect.width / W;
      var scaleY = svgRect.height / H;
      var tipX = (pt.x * scaleX) + (svgRect.left - rect.left);
      var tipY = (pt.y * scaleY) + (svgRect.top - rect.top) - 50;
      tooltip.style.left = tipX + 'px';
      tooltip.style.top = tipY + 'px';
      tooltip.style.transform = 'translateX(-50%)';

      /* Highlight dot */
      var dot = container.querySelector('.weight-dot[data-idx="' + idx + '"]');
      if (dot) { dot.setAttribute('r', '6'); }
    });

    hit.addEventListener('mouseleave', function() {
      crosshair.style.opacity = '0';
      tooltip.classList.remove('is-visible');
      var idx = parseInt(hit.dataset.idx, 10);
      var dot = container.querySelector('.weight-dot[data-idx="' + idx + '"]');
      var isEdge = (idx === 0 || idx === points.length - 1);
      if (dot) { dot.setAttribute('r', isEdge ? '5' : '3.5'); }
    });
  });
};

/* ── Engagement gauges ── */
EnaraApp._renderEngageGrid = function(patientId) {
  var m = EnaraApp.ENGAGEMENT_METRICS[patientId];
  if (!m) return;

  var items = [
    { label: 'App Logins<br>(7d)', value: m.appLogins7d, max: 7, unit: '' },
    { label: 'Appointment<br>Rate', value: m.appointmentRate, max: 100, unit: '%' },
    { label: 'Labs<br>Complete', value: m.labsComplete, max: 100, unit: '%' },
    { label: 'Group<br>Classes', value: m.groupClasses, max: 10, unit: '' },
    { label: 'Behavioral<br>Visits', value: m.behavioralVisits, max: 8, unit: '' }
  ];

  var grid = document.getElementById('profile-engage-grid');
  grid.innerHTML = items.map(function(item, i) {
    var pct = Math.min((item.value / item.max) * 100, 100);
    var r = 22, circ = 2 * Math.PI * r;
    var offset = circ - (pct / 100) * circ;
    var color = pct >= 80 ? 'var(--color-success)' :
                pct >= 50 ? 'var(--color-primary)' :
                pct >= 30 ? 'var(--color-warning)' : 'var(--color-danger)';

    return '<div class="engage-item">' +
      '<svg width="56" height="56" viewBox="0 0 56 56" class="engage-item__ring">' +
        '<circle cx="28" cy="28" r="' + r + '" fill="none" stroke="var(--color-border-light)" stroke-width="5"/>' +
        '<circle cx="28" cy="28" r="' + r + '" fill="none" stroke="' + color + '" stroke-width="5" ' +
          'stroke-linecap="round" stroke-dasharray="' + circ.toFixed(1) + '" ' +
          'stroke-dashoffset="' + circ.toFixed(1) + '" ' +
          'transform="rotate(-90 28 28)" class="engage-ring-fill" ' +
          'data-target="' + offset.toFixed(1) + '" ' +
          'style="transition:stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1) ' + (i * 100) + 'ms"/>' +
      '</svg>' +
      '<div class="engage-item__value" style="color:' + color + '">' + item.value + item.unit + '</div>' +
      '<div class="engage-item__label">' + item.label + '</div>' +
    '</div>';
  }).join('');
};

/* ── Appointment timeline ── */
EnaraApp._renderTimeline = function(patientId) {
  var appts = EnaraApp.APPOINTMENTS[patientId];
  var el = document.getElementById('profile-timeline');
  var countEl = document.getElementById('profile-appt-count');

  if (!appts || !appts.length) {
    el.innerHTML = '<div style="font-size:0.8rem;color:var(--color-text-muted);padding:12px 0">No appointment history available for this patient.</div>';
    countEl.textContent = '0 visits';
    return;
  }

  countEl.textContent = appts.length + ' visits';

  /* Show most recent first */
  var reversed = appts.slice().reverse();
  el.innerHTML = reversed.map(function(a, i) {
    var statusClass = 'timeline__dot--' + a.status;
    var pillClass = 'timeline__status-pill--' + a.status;
    return '<div class="timeline__item" style="animation-delay:' + (i * 60) + 'ms">' +
      '<div class="timeline__dot ' + statusClass + '"></div>' +
      '<div class="timeline__header">' +
        '<span class="timeline__date">' + a.date + '</span>' +
        '<span class="timeline__type">' + a.type + '</span>' +
        '<span class="timeline__status-pill ' + pillClass + '">' + a.status + '</span>' +
      '</div>' +
      '<div class="timeline__note">' + a.note + '</div>' +
    '</div>';
  }).join('');
};

/* ── SHAP bars (reuse drawer pattern) ── */
EnaraApp._renderProfileShap = function(p) {
  var maxVal = Math.max.apply(null, p.factors.map(function(f) { return Math.abs(f.value); }));
  var barsHtml = p.factors.map(function(f) {
    var pct = (Math.abs(f.value) / maxVal) * 42;
    var isNeg = f.value > 0;
    var barClass = isNeg ? 'shap-bar--negative' : 'shap-bar--positive';
    var numClass = isNeg ? 'shap-value--negative' : 'shap-value--positive';
    var sign = f.value > 0 ? '+' : '';
    return '<div class="shap-row">' +
      '<div class="shap-label">' + f.text + '</div>' +
      '<div class="shap-track"><div class="shap-midline"></div>' +
        '<div class="shap-bar ' + barClass + '" style="width:' + pct + '%"></div></div>' +
      '<div class="shap-value ' + numClass + '">' + sign + f.value.toFixed(2) + '</div>' +
    '</div>';
  }).join('');
  document.getElementById('profile-shap-bars').innerHTML = barsHtml;
};

/* ── Animate profile gauges ── */
EnaraApp.animateProfileGauges = function() {
  /* Large risk gauge */
  document.querySelectorAll('.profile-gauge__fill').forEach(function(ring) {
    var circ = 2 * Math.PI * 38;
    ring.style.transition = 'none';
    ring.style.strokeDashoffset = circ.toFixed(1);
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        ring.style.transition = 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)';
        ring.style.strokeDashoffset = ring.dataset.target;
      });
    });
  });

  /* Engagement rings */
  document.querySelectorAll('.engage-ring-fill').forEach(function(ring) {
    var circ = 2 * Math.PI * 22;
    var currentOffset = ring.style.strokeDashoffset;
    ring.style.strokeDashoffset = circ.toFixed(1);
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        ring.style.strokeDashoffset = ring.dataset.target;
      });
    });
  });
};
