/**
 * ==========================================================
 * DRAWER MODULE
 * Slide-in panel from the right that shows detailed SHAP
 * explanation for the selected patient.
 * ==========================================================
 */

/* ----- Open / Close ----- */
EnaraApp.openDrawer = function(patientId) {
  var p = EnaraApp.PATIENTS.find(function(x) { return x.id === patientId; });
  if (!p) return;

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

  /* Build factor tags */
  var tags = p.factors.map(function(f) {
    var tagClass = f.type === 'negative' ? 'drawer-tag--negative' : 'drawer-tag--positive';
    return '<span class="drawer-tag ' + tagClass + '">' + f.text + '</span>';
  }).join('');

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
        '<div style="display:flex;gap:6px;margin-bottom:3px">' +
          '<span class="badge ' + riskBadge + '">' + p.riskLevel + ' Risk</span>' +
          '<span class="badge ' + priBadge + '">' + p.priority + ' Priority</span>' +
        '</div>' +
        '<div style="font-size:.75rem;color:var(--color-text-muted)">' +
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
      '<div class="drawer-tags">' + tags + '</div>' +
    '</div>' +

    '<div class="drawer-section fade-in" style="animation-delay:.13s">' +
      '<h4 class="drawer-section__title">SHAP Feature Contributions</h4>' +
      '<div style="font-size:.7rem;color:var(--color-text-muted);margin-bottom:10px">' +
        'Red = pushes toward dropout · Green = supports retention</div>' +
      shapBars +
    '</div>' +

    '<div class="drawer-section fade-in" style="animation-delay:.16s">' +
      '<h4 class="drawer-section__title">Recommended Action</h4>' +
      '<button class="drawer-action">' +
        (p.action === 'No action needed' ? '✅ No action needed' : '→ ' + p.action) +
      '</button>' +
    '</div>' +

    '<div class="shap-note fade-in" style="animation-delay:.2s">' +
      '⚠️ These factors influenced the model prediction. They are not direct clinical causes. ' +
      'Clinical judgment should always guide intervention decisions.' +
    '</div>';

  /* Show drawer */
  document.getElementById('drawer-overlay').classList.add('is-open');
  document.getElementById('drawer-panel').classList.add('is-open');

  /* Also update bottom panel (visible when drawer closes) */
  document.getElementById('shap-panel-content').innerHTML =
    '<div class="shap-summary">' + p.summary + '</div>' +
    '<div style="margin-top:8px">' + shapBars + '</div>';
  document.getElementById('shap-panel-title').textContent =
    '🧠 Why the model is concerned — ' + p.name;
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
