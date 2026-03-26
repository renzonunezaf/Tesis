/**
 * ==========================================================
 * DRAWER MODULE
 * Slide-in panel from the right that shows detailed SHAP
 * explanation for the selected patient.
 * ==========================================================
 */

/* ----- Open / Close ----- */
EnaraApp.openDrawer = function(patientId) {
  EnaraApp.api.getPatientById(patientId).then(function(p) {
    EnaraApp._renderDrawerContent(p);
  }).catch(function(err) {
    EnaraApp.showError('drawer-body', 'Could not load patient data: ' + err.message);
    document.getElementById('drawer-overlay').classList.add('is-open');
    document.getElementById('drawer-panel').classList.add('is-open');
  });
};

/** Internal: populate drawer with patient data */
EnaraApp._renderDrawerContent = function(p) {

  var riskColor = EnaraApp.getRiskColor(p.risk);
  var riskBadge = EnaraApp.RISK_BADGE_CLASS[p.riskLevel];
  var priBadge  = EnaraApp.RISK_BADGE_CLASS[p.priority];

  /* Build SHAP bars */
  var maxVal = Math.max.apply(null, p.factors.map(function(f) { return Math.abs(f.value); }));
  var shapBars = p.factors.map(function(f) {
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

  /* Build factor tags — REMOVED from table, now only in drawer as SVG tornado */
  var factorsSvg = EnaraApp._buildFactorsTornado(p.factors);

  /* Populate drawer */
  document.getElementById('drawer-title').textContent = 'Why the model is concerned';
  document.getElementById('drawer-subtitle').textContent =
    p.id + ' · ' + p.risk + '% dropout risk · ' + p.medTrack + ' · ' + p.modality;

  var sexLabel = p.sex === 'F' ? 'Female' : 'Male';
  document.getElementById('drawer-body').innerHTML =
    '<div class="drawer-patient fade-in">' +
      '<div class="drawer-patient__avatar" style="background:' + riskColor + '">' + p.initials + '</div>' +
      '<div>' +
        '<div class="drawer-patient__name">' + p.name + '</div>' +
        '<div class="drawer-patient__meta">' +
          p.id + ' · ' + p.age + 'y/o · ' + sexLabel + ' · ' + p.state + '<br>' +
          p.insurer + ' · ' + p.clinic + ' · ' + p.weeks + ' weeks<br>' +
          'Engagement: <strong>' + p.engagement + '</strong> · Assigned: <strong>' + p.owner + '</strong>' +
        '</div>' +
      '</div>' +
    '</div>' +

    '<div class="drawer-risk fade-in" style="animation-delay:.05s">' +
      '<div class="drawer-risk__score" style="color:' + riskColor + '">' + p.risk + '%</div>' +
      '<div class="drawer-risk__details">' +
        '<div class="drawer-risk__badges">' +
          '<span class="badge ' + riskBadge + '">' + p.riskLevel + ' Risk</span>' +
          '<span class="badge ' + priBadge + '">' + p.priority + ' Priority</span>' +
        '</div>' +
        '<div class="drawer-risk__meta">' +
          'Dropout window: ~' + p.dropoutWindow + 'd · Last appt: ' + p.lastAppt + ' · ' + p.daysSince + 'd since contact' +
        '</div>' +
        '<div class="drawer-risk__bar"><div class="drawer-risk__bar-fill" style="width:' + p.risk + '%;background:' + riskColor + '"></div></div>' +
      '</div>' +
    '</div>' +

    '<div class="drawer-section fade-in" style="animation-delay:.08s">' +
      '<h4 class="drawer-section__title">Summary</h4>' +
      '<div class="shap-summary">' + p.summary + '</div>' +
    '</div>' +

    '<div class="drawer-section fade-in" style="animation-delay:.1s">' +
      '<h4 class="drawer-section__title">Risk & Protective Factors</h4>' +
      '<div class="drawer-hint--sm">' +
        '<span class="drawer-hint__protect">← Protective</span> · ' +
        '<span class="drawer-hint__risk">Risk →</span></div>' +
      factorsSvg +
    '</div>' +

    '<div class="drawer-section fade-in" style="animation-delay:.13s">' +
      '<h4 class="drawer-section__title">SHAP Feature Contributions</h4>' +
      '<div class="drawer-hint">Red = pushes toward dropout · Green = supports retention</div>' +
      shapBars +
    '</div>' +

    '<div class="drawer-section fade-in" style="animation-delay:.16s">' +
      '<h4 class="drawer-section__title">Recommended Action</h4>' +
      '<button class="drawer-action">' +
        (p.action === 'No action needed' ? 'No action needed' : '→ ' + p.action) +
      '</button>' +
    '</div>' +

    '<div class="drawer-section fade-in" style="animation-delay:.2s">' +
      '<button class="drawer-action drawer-action--hero" ' +
        'onclick="EnaraApp.openProfile(\'' + p.id + '\')">' +
        'View Full Profile' +
      '</button>' +
    '</div>' +

    '<div class="shap-note fade-in" style="animation-delay:.24s">' +
      'These factors influenced the model prediction. They are not direct clinical causes. ' +
      'Clinical judgment should always guide intervention decisions.' +
    '</div>';

  /* Show drawer */
  document.getElementById('drawer-overlay').classList.add('is-open');
  document.getElementById('drawer-panel').classList.add('is-open');

  /* Also update bottom panel (visible when drawer closes) */
  document.getElementById('shap-panel-content').innerHTML =
    '<div class="shap-summary">' + p.summary + '</div>' +
    '<div class="shap-panel__bars">' + shapBars + '</div>';
  document.getElementById('shap-panel-title').textContent =
    'Why the model is concerned — ' + p.name;
  document.getElementById('shap-panel-subtitle').textContent =
    p.id + ' · ' + p.risk + '% risk · ' + p.medTrack + ' · ' + p.modality;
};

EnaraApp.closeDrawer = function() {
  document.getElementById('drawer-overlay').classList.remove('is-open');
  document.getElementById('drawer-panel').classList.remove('is-open');
};

EnaraApp.initDrawer = function() {
  document.getElementById('drawer-overlay').addEventListener('click', EnaraApp.closeDrawer);
  document.getElementById('drawer-close').addEventListener('click', EnaraApp.closeDrawer);
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') EnaraApp.closeDrawer();
  });
};

/**
 * Build an SVG tornado / butterfly chart for SHAP factors.
 * Risk factors (positive value) go RIGHT in red.
 * Protective factors (negative value) go LEFT in green.
 * Center axis = neutral baseline.
 */
EnaraApp._buildFactorsTornado = function(factors) {
  /* Sort: largest absolute value first */
  var sorted = factors.slice().sort(function(a, b) {
    return Math.abs(b.value) - Math.abs(a.value);
  });

  var rowH = 28;            /* Height per factor row */
  var padT = 6;             /* Top padding */
  var padB = 6;             /* Bottom padding */
  var W = 460;              /* SVG width */
  var H = padT + sorted.length * rowH + padB;
  var midX = W * 0.5;       /* Center axis position */
  var barZone = midX - 12;  /* Max bar length per side */
  var maxVal = Math.max.apply(null, sorted.map(function(f) { return Math.abs(f.value); }));

  var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" class="tornado-svg">';

  /* Center axis */
  svg += '<line x1="' + midX + '" y1="' + (padT - 2) + '" x2="' + midX + '" y2="' + (H - padB + 2) + '" ' +
    'stroke="var(--color-border)" stroke-width="1.5"/>';

  sorted.forEach(function(f, i) {
    var y = padT + i * rowH;
    var barY = y + 6;
    var barH2 = 16;
    var pct = Math.abs(f.value) / maxVal;
    var barLen = pct * barZone;
    var isRisk = f.value > 0;
    var color = isRisk ? 'var(--color-danger)' : 'var(--color-success)';
    var lightColor = isRisk ? 'rgba(229,62,62,0.12)' : 'rgba(56,161,105,0.12)';
    var sign = f.value > 0 ? '+' : '';

    /* Alternating row bg for readability */
    if (i % 2 === 0) {
      svg += '<rect x="0" y="' + y + '" width="' + W + '" height="' + rowH + '" fill="var(--color-bg)" opacity="0.5"/>';
    }

    if (isRisk) {
      /* Risk bar: from center going RIGHT */
      svg += '<rect x="' + midX + '" y="' + barY + '" width="' + barLen + '" height="' + barH2 + '" ' +
        'rx="4" fill="' + color + '" opacity="0.75"/>';
      /* Glow background */
      svg += '<rect x="' + midX + '" y="' + barY + '" width="' + barLen + '" height="' + barH2 + '" ' +
        'rx="4" fill="' + lightColor + '"/>';

      /* Label: to the left of center */
      svg += '<text x="' + (midX - 8) + '" y="' + (barY + 12) + '" text-anchor="end" ' +
        'font-size="9.5" fill="var(--color-text-secondary)" font-weight="500">' + f.text + '</text>';

      /* Value at bar tip */
      svg += '<text x="' + (midX + barLen + 5) + '" y="' + (barY + 12) + '" text-anchor="start" ' +
        'font-size="9" fill="' + color + '" font-weight="700">' + sign + f.value.toFixed(2) + '</text>';
    } else {
      /* Protective bar: from center going LEFT */
      svg += '<rect x="' + (midX - barLen) + '" y="' + barY + '" width="' + barLen + '" height="' + barH2 + '" ' +
        'rx="4" fill="' + color + '" opacity="0.75"/>';
      svg += '<rect x="' + (midX - barLen) + '" y="' + barY + '" width="' + barLen + '" height="' + barH2 + '" ' +
        'rx="4" fill="' + lightColor + '"/>';

      /* Label: to the right of center */
      svg += '<text x="' + (midX + 8) + '" y="' + (barY + 12) + '" text-anchor="start" ' +
        'font-size="9.5" fill="var(--color-text-secondary)" font-weight="500">' + f.text + '</text>';

      /* Value at bar tip */
      svg += '<text x="' + (midX - barLen - 5) + '" y="' + (barY + 12) + '" text-anchor="end" ' +
        'font-size="9" fill="' + color + '" font-weight="700">' + f.value.toFixed(2) + '</text>';
    }
  });

  svg += '</svg>';
  return svg;
};
