/**
 * ==========================================================
 * MODEL PERFORMANCE MODULE
 * Comprehensive model evaluation dashboard:
 * - Confusion matrix (SVG heatmap)
 * - ROC curve (SVG line chart with AUC shading)
 * - Feature importance (horizontal bars, top 10)
 * - Model comparison table (LR vs RF vs XGBoost)
 * - Cross-validation fold scores
 * ==========================================================
 */

EnaraApp.renderModelPerformance = function() {
  var el = document.getElementById('view-model');
  if (!el) return;

  var html = '';

  /* ── Header ── */
  html += '<div class="mp-header">' +
    '<div class="mp-headline">Model <span>Performance</span></div>' +
    '<div class="mp-tagline">Random Forest + SHAP · CRISP-DM · Trained on 1,247 patients · Last retrain: Mar 24, 2026</div>' +
  '</div>';

  /* ── Summary badges ── */
  html += '<div class="mp-badges">' +
    '<div class="mp-badge mp-badge--success">Accuracy: 89%</div>' +
    '<div class="mp-badge mp-badge--success">AUC: 0.93</div>' +
    '<div class="mp-badge mp-badge--primary">F1-Score: 0.86</div>' +
    '<div class="mp-badge mp-badge--primary">Recall: 88%</div>' +
    '<div class="mp-badge mp-badge--primary">Precision: 85%</div>' +
  '</div>';

  /* ── Row 1: Model Comparison + Selected Model ── */
  html += '<div class="mp-row mp-row--2col">';

  /* Model comparison table */
  html += '<div class="mp-card">' +
    '<div class="mp-card__title">Algorithm Comparison</div>' +
    '<div class="mp-card__sub">Three models evaluated during CRISP-DM modeling phase</div>' +
    '<div id="mp-comparison"></div>' +
  '</div>';

  /* Selected model summary */
  html += '<div class="mp-card">' +
    '<div class="mp-card__title">Selected: Random Forest</div>' +
    '<div class="mp-card__sub">Best overall balance of accuracy, recall, and interpretability</div>' +
    '<div class="mp-selected" id="mp-selected"></div>' +
  '</div>';

  html += '</div>';

  /* ── Row 2: Confusion Matrix + ROC Curve ── */
  html += '<div class="mp-row mp-row--2col">';

  html += '<div class="mp-card">' +
    '<div class="mp-card__title">Confusion Matrix</div>' +
    '<div class="mp-card__sub">Test set performance (n=1,247)</div>' +
    '<div class="mp-cm" id="mp-confusion"></div>' +
  '</div>';

  html += '<div class="mp-card">' +
    '<div class="mp-card__title">ROC Curve</div>' +
    '<div class="mp-card__sub">AUC = 0.93 — Random Forest on holdout set</div>' +
    '<div class="mp-roc" id="mp-roc"></div>' +
  '</div>';

  html += '</div>';

  /* ── Row 3: Feature Importance + CV Scores ── */
  html += '<div class="mp-row mp-row--2col">';

  html += '<div class="mp-card">' +
    '<div class="mp-card__title">SHAP Feature Importance (Top 10)</div>' +
    '<div class="mp-card__sub">Mean absolute SHAP value across all predictions</div>' +
    '<div class="mp-features" id="mp-features"></div>' +
  '</div>';

  html += '<div class="mp-card">' +
    '<div class="mp-card__title">5-Fold Cross-Validation</div>' +
    '<div class="mp-card__sub">Accuracy and F1 stability across folds</div>' +
    '<div class="mp-cv" id="mp-cv"></div>' +
  '</div>';

  html += '</div>';

  el.innerHTML = html;

  /* Render sub-components */
  EnaraApp._renderModelComparison();
  EnaraApp._renderSelectedModel();
  EnaraApp._renderConfusionMatrix();
  EnaraApp._renderROC();
  EnaraApp._renderFeatureImportance();
  EnaraApp._renderCVScores();
};

/* ── Model comparison table ── */
EnaraApp._renderModelComparison = function() {
  var el = document.getElementById('mp-comparison');
  var models = EnaraApp.MODEL_COMPARISON;
  var best = models[1]; /* Random Forest */

  var header = '<div class="mp-table-row mp-table-row--header">' +
    '<div class="mp-table-cell mp-table-cell--name">Model</div>' +
    '<div class="mp-table-cell">Accuracy</div>' +
    '<div class="mp-table-cell">Precision</div>' +
    '<div class="mp-table-cell">Recall</div>' +
    '<div class="mp-table-cell">F1</div>' +
    '<div class="mp-table-cell">AUC</div>' +
    '<div class="mp-table-cell">Train</div>' +
  '</div>';

  var rows = models.map(function(m) {
    var isBest = m.name === 'Random Forest';
    var rowCls = isBest ? ' mp-table-row--selected' : '';
    return '<div class="mp-table-row' + rowCls + '">' +
      '<div class="mp-table-cell mp-table-cell--name">' + m.name + (isBest ? ' ✓' : '') + '</div>' +
      '<div class="mp-table-cell">' + (m.accuracy * 100).toFixed(0) + '%</div>' +
      '<div class="mp-table-cell">' + (m.precision * 100).toFixed(0) + '%</div>' +
      '<div class="mp-table-cell">' + (m.recall * 100).toFixed(0) + '%</div>' +
      '<div class="mp-table-cell">' + (m.f1 * 100).toFixed(0) + '%</div>' +
      '<div class="mp-table-cell">' + m.auc.toFixed(2) + '</div>' +
      '<div class="mp-table-cell">' + m.trainTime + '</div>' +
    '</div>';
  }).join('');

  el.innerHTML = header + rows;
};

/* ── Selected model ring gauges ── */
EnaraApp._renderSelectedModel = function() {
  var el = document.getElementById('mp-selected');
  var rf = EnaraApp.MODEL_COMPARISON[1];
  var metrics = [
    { label: 'Accuracy', value: rf.accuracy, color: 'var(--color-success)' },
    { label: 'Recall', value: rf.recall, color: 'var(--color-primary)' },
    { label: 'Precision', value: rf.precision, color: 'var(--color-primary-dark)' },
    { label: 'AUC', value: rf.auc, color: 'var(--color-success)' }
  ];

  el.innerHTML = '<div class="mp-gauge-row">' + metrics.map(function(m) {
    var r = 30, circ = 2 * Math.PI * r;
    var offset = circ - m.value * circ;
    return '<div class="mp-gauge-item">' +
      '<svg width="76" height="76" viewBox="0 0 76 76">' +
        '<circle cx="38" cy="38" r="' + r + '" fill="none" stroke="var(--color-border-light)" stroke-width="6"/>' +
        '<circle cx="38" cy="38" r="' + r + '" fill="none" stroke="' + m.color + '" stroke-width="6" ' +
          'stroke-linecap="round" stroke-dasharray="' + circ.toFixed(1) + '" ' +
          'stroke-dashoffset="' + circ.toFixed(1) + '" ' +
          'transform="rotate(-90 38 38)" class="mp-ring-fill" data-target="' + offset.toFixed(1) + '"/>' +
        '<text x="38" y="36" text-anchor="middle" font-size="16" font-weight="700" fill="' + m.color + '">' + (m.value * 100).toFixed(0) + '</text>' +
        '<text x="38" y="47" text-anchor="middle" font-size="8" fill="var(--color-text-muted)">%</text>' +
      '</svg>' +
      '<div class="mp-gauge-label">' + m.label + '</div>' +
    '</div>';
  }).join('') + '</div>';
};

/* ── Confusion Matrix (SVG) ── */
EnaraApp._renderConfusionMatrix = function() {
  var el = document.getElementById('mp-confusion');
  var cm = EnaraApp.CONFUSION_MATRIX;
  var labels = cm.labels;
  var vals = cm.values;
  var total = vals[0][0] + vals[0][1] + vals[1][0] + vals[1][1];

  /* Color by value */
  function cellClass(val, isDiag) {
    return isDiag ? 'mp-cm-cell--good' : 'mp-cm-cell--bad';
  }

  var html = '<div class="mp-cm-grid">';

  /* Header row */
  html += '<div class="mp-cm-corner">Actual ↓ Predicted →</div>';
  html += '<div class="mp-cm-header">' + labels[0] + '</div>';
  html += '<div class="mp-cm-header">' + labels[1] + '</div>';

  /* Row 0: Actual = Stayed */
  html += '<div class="mp-cm-label">' + labels[0] + '</div>';
  html += '<div class="mp-cm-cell mp-cm-cell--good mp-cm-anim" style="opacity:0">' +
    '<div class="mp-cm-val">' + vals[0][0] + '</div><div class="mp-cm-pct">TN · ' + ((vals[0][0]/total)*100).toFixed(1) + '%</div></div>';
  html += '<div class="mp-cm-cell mp-cm-cell--bad mp-cm-anim" style="opacity:0">' +
    '<div class="mp-cm-val">' + vals[0][1] + '</div><div class="mp-cm-pct">FP · ' + ((vals[0][1]/total)*100).toFixed(1) + '%</div></div>';

  /* Row 1: Actual = Dropped Out */
  html += '<div class="mp-cm-label">' + labels[1] + '</div>';
  html += '<div class="mp-cm-cell mp-cm-cell--bad mp-cm-anim" style="opacity:0">' +
    '<div class="mp-cm-val">' + vals[1][0] + '</div><div class="mp-cm-pct">FN · ' + ((vals[1][0]/total)*100).toFixed(1) + '%</div></div>';
  html += '<div class="mp-cm-cell mp-cm-cell--good mp-cm-anim" style="opacity:0">' +
    '<div class="mp-cm-val">' + vals[1][1] + '</div><div class="mp-cm-pct">TP · ' + ((vals[1][1]/total)*100).toFixed(1) + '%</div></div>';

  html += '</div>';
  el.innerHTML = html;
};

/* ── ROC Curve (SVG) ── */
EnaraApp._renderROC = function() {
  var el = document.getElementById('mp-roc');
  var pts = EnaraApp.ROC_POINTS;
  var W = 280, H = 240, pad = 40;
  var chartW = W - pad * 2, chartH = H - pad * 2;

  function sx(v) { return pad + v * chartW; }
  function sy(v) { return pad + (1 - v) * chartH; }

  var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" class="mp-roc-svg">';

  /* Grid */
  for (var g = 0; g <= 4; g++) {
    var gv = g / 4;
    svg += '<line x1="' + sx(0) + '" y1="' + sy(gv) + '" x2="' + sx(1) + '" y2="' + sy(gv) + '" stroke="var(--color-border-light)" stroke-width="1"/>';
    svg += '<line x1="' + sx(gv) + '" y1="' + sy(0) + '" x2="' + sx(gv) + '" y2="' + sy(1) + '" stroke="var(--color-border-light)" stroke-width="1"/>';
    svg += '<text x="' + (sx(gv)) + '" y="' + (H - 12) + '" text-anchor="middle" font-size="9" fill="var(--color-text-light)">' + (gv).toFixed(1) + '</text>';
    svg += '<text x="' + (pad - 8) + '" y="' + (sy(gv) + 3) + '" text-anchor="end" font-size="9" fill="var(--color-text-light)">' + (gv).toFixed(1) + '</text>';
  }

  /* Diagonal reference */
  svg += '<line x1="' + sx(0) + '" y1="' + sy(0) + '" x2="' + sx(1) + '" y2="' + sy(1) + '" stroke="var(--color-border)" stroke-width="1" stroke-dasharray="4,4"/>';

  /* AUC shading */
  var areaPath = 'M' + pts.map(function(p) { return sx(p.fpr) + ',' + sy(p.tpr); }).join(' L') +
    ' L' + sx(1) + ',' + sy(0) + ' L' + sx(0) + ',' + sy(0) + ' Z';
  svg += '<path d="' + areaPath + '" fill="rgba(56,159,186,0.1)" class="roc-area"/>';

  /* ROC line */
  var linePath = 'M' + pts.map(function(p) { return sx(p.fpr) + ',' + sy(p.tpr); }).join(' L');
  svg += '<path d="' + linePath + '" fill="none" stroke="var(--color-primary)" stroke-width="2.5" ' +
    'stroke-linecap="round" stroke-linejoin="round" id="roc-line" ' +
    'stroke-dasharray="600" stroke-dashoffset="600"/>';

  /* Dots */
  pts.forEach(function(p, i) {
    if (i === 0 || i === pts.length - 1) return;
    svg += '<circle cx="' + sx(p.fpr) + '" cy="' + sy(p.tpr) + '" r="3" fill="var(--color-primary)" stroke="var(--color-card)" stroke-width="1.5" class="roc-dot"/>';
  });

  /* AUC label */
  svg += '<text x="' + sx(0.55) + '" y="' + sy(0.35) + '" font-size="12" font-weight="700" fill="var(--color-primary)" opacity="0.6">AUC = 0.93</text>';

  /* Axis labels */
  svg += '<text x="' + (W / 2) + '" y="' + (H - 1) + '" text-anchor="middle" font-size="10" fill="var(--color-text-muted)">False Positive Rate</text>';
  svg += '<text x="12" y="' + (H / 2) + '" text-anchor="middle" font-size="10" fill="var(--color-text-muted)" transform="rotate(-90 12 ' + (H/2) + ')">True Positive Rate</text>';

  svg += '</svg>';
  el.innerHTML = svg;
};

/* ── Feature Importance (horizontal bars) ── */
EnaraApp._renderFeatureImportance = function() {
  var el = document.getElementById('mp-features');
  var features = EnaraApp.FEATURE_IMPORTANCE;
  var maxImp = features[0].importance;

  el.innerHTML = features.map(function(f, i) {
    var pct = (f.importance / maxImp) * 100;
    var opacity = 1 - (i * 0.06);
    return '<div class="mp-feat-row">' +
      '<div class="mp-feat-rank">' + (i + 1) + '</div>' +
      '<div class="mp-feat-name">' + f.feature + '</div>' +
      '<div class="mp-feat-track"><div class="mp-feat-bar seg-fill" data-pct="' + pct.toFixed(0) + '" ' +
        'style="background:var(--color-primary);opacity:' + opacity + '"></div></div>' +
      '<div class="mp-feat-val">' + (f.importance * 100).toFixed(0) + '%</div>' +
    '</div>';
  }).join('');
};

/* ── Cross-validation scores ── */
EnaraApp._renderCVScores = function() {
  var el = document.getElementById('mp-cv');
  var cv = EnaraApp.CV_SCORES;

  /* Accuracy bars */
  var accMean = cv.accuracy.reduce(function(a,b){return a+b;},0) / cv.accuracy.length;
  var f1Mean = cv.f1.reduce(function(a,b){return a+b;},0) / cv.f1.length;

  var html = '<div class="mp-cv-summary">' +
    '<div class="mp-cv-stat"><div class="mp-cv-stat-val" style="color:var(--color-success)">' + (accMean*100).toFixed(1) + '%</div><div class="mp-cv-stat-label">Mean Accuracy</div></div>' +
    '<div class="mp-cv-stat"><div class="mp-cv-stat-val" style="color:var(--color-primary)">' + (f1Mean*100).toFixed(1) + '%</div><div class="mp-cv-stat-label">Mean F1</div></div>' +
  '</div>';

  html += '<div class="mp-cv-folds">';
  cv.folds.forEach(function(fold, i) {
    var accPct = (cv.accuracy[i] * 100);
    var f1Pct = (cv.f1[i] * 100);
    html += '<div class="mp-cv-fold">' +
      '<div class="mp-cv-fold-label">' + fold + '</div>' +
      '<div class="mp-cv-bars">' +
        '<div class="mp-cv-bar-wrap"><div class="mp-cv-bar seg-fill" data-pct="' + accPct.toFixed(0) + '" style="background:var(--color-success)"></div></div>' +
        '<div class="mp-cv-bar-wrap"><div class="mp-cv-bar seg-fill" data-pct="' + f1Pct.toFixed(0) + '" style="background:var(--color-primary)"></div></div>' +
      '</div>' +
      '<div class="mp-cv-vals">' +
        '<span style="color:var(--color-success)">' + accPct.toFixed(0) + '%</span>' +
        '<span style="color:var(--color-primary)">' + f1Pct.toFixed(0) + '%</span>' +
      '</div>' +
    '</div>';
  });
  html += '</div>';

  html += '<div class="mp-cv-legend">' +
    '<span class="mp-cv-legend-item"><span class="mp-cv-dot" style="background:var(--color-success)"></span> Accuracy</span>' +
    '<span class="mp-cv-legend-item"><span class="mp-cv-dot" style="background:var(--color-primary)"></span> F1-Score</span>' +
  '</div>';

  el.innerHTML = html;
};

/* ── Animate model performance ── */
EnaraApp.animateModelPerformance = function(container) {
  var root = container || document;

  /* Ring gauges */
  root.querySelectorAll('.mp-ring-fill').forEach(function(r) {
    var circ = 2 * Math.PI * 30;
    r.style.transition = 'none'; r.style.strokeDashoffset = circ.toFixed(1);
  });
  /* Feature bars + CV bars */
  root.querySelectorAll('.seg-fill[data-pct]').forEach(function(el) {
    el.style.transition = 'none'; el.style.width = '0%';
  });
  /* Confusion matrix cells */
  root.querySelectorAll('.mp-cm-anim').forEach(function(el) {
    el.style.transition = 'none'; el.style.opacity = '0'; el.style.transform = 'scale(0.8)';
  });
  /* ROC line */
  var rocLine = document.getElementById('roc-line');
  if (rocLine) { rocLine.style.transition = 'none'; rocLine.style.strokeDashoffset = '600'; }
  /* ROC dots */
  root.querySelectorAll('.roc-dot').forEach(function(d) { d.style.transition = 'none'; d.style.opacity = '0'; });
  /* ROC area */
  var rocArea = root.querySelector('.roc-area');
  if (rocArea) { rocArea.style.transition = 'none'; rocArea.style.opacity = '0'; }

  requestAnimationFrame(function() { requestAnimationFrame(function() {
    root.querySelectorAll('.mp-ring-fill').forEach(function(r, i) {
      r.style.transition = 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1) ' + (i * 100) + 'ms';
      r.style.strokeDashoffset = r.dataset.target;
    });
    root.querySelectorAll('.seg-fill[data-pct]').forEach(function(el, i) {
      el.style.transition = 'width 0.8s cubic-bezier(0.4,0,0.2,1) ' + (i * 40) + 'ms';
      el.style.width = el.getAttribute('data-pct') + '%';
    });
    root.querySelectorAll('.mp-cm-anim').forEach(function(el, i) {
      el.style.transition = 'opacity 0.5s ease ' + (i * 120) + 'ms, transform 0.5s cubic-bezier(0.34,1.56,0.64,1) ' + (i * 120) + 'ms';
      el.style.opacity = '1'; el.style.transform = 'scale(1)';
    });
    if (rocLine) {
      rocLine.style.transition = 'stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1) 0.3s';
      rocLine.style.strokeDashoffset = '0';
    }
    if (rocArea) { rocArea.style.transition = 'opacity 0.8s ease 0.8s'; rocArea.style.opacity = '1'; }
    root.querySelectorAll('.roc-dot').forEach(function(d, i) {
      d.style.transition = 'opacity 0.3s ease ' + (800 + i * 80) + 'ms'; d.style.opacity = '1';
    });
  }); });
};
