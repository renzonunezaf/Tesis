/**
 * ==========================================================
 * CHARTS MODULE v2
 * SVG-based area chart for trend, animated distribution
 * bars, and donut chart for risk split.
 * ==========================================================
 */

/* ----- Risk Distribution: Animated horizontal bars with icons ----- */
EnaraApp.renderDistribution = function() {
  var container = document.getElementById('dist-bars');
  var total = 1247;

  container.innerHTML = EnaraApp.DISTRIBUTION.map(function(d, i) {
    var pct = (d.count / total) * 100;
    var displayPct = Math.max(pct, 3);
    return '<div class="dist-row fade-in" style="animation-delay:' + (i * 80) + 'ms">' +
      '<div class="dist-label" style="color:' + d.color + '">' + d.label + '</div>' +
      '<div class="dist-track">' +
        '<div class="dist-fill" style="width:0%;background:' + d.color + '" data-width="' + displayPct + '%">' +
          d.count +
        '</div>' +
      '</div>' +
      '<div class="dist-count" style="color:' + d.color + '">' +
        '<span class="dist-pct">' + pct.toFixed(1) + '%</span>' +
      '</div>' +
    '</div>';
  }).join('');

  /* Animate bar widths after render */
  requestAnimationFrame(function() {
    setTimeout(function() {
      document.querySelectorAll('.dist-fill').forEach(function(bar) {
        bar.style.width = bar.dataset.width;
      });
    }, 200);
  });
};

/* ----- Trend: SVG area chart with gradient fill ----- */
EnaraApp.renderTrend = function() {
  var data = EnaraApp.TREND_DATA;
  var maxVal = Math.max.apply(null, data.map(function(d) { return d.value; }));
  var minVal = Math.min.apply(null, data.map(function(d) { return d.value; }));
  var chartW = 400;
  var chartH = 120;
  var padX = 10;
  var padTop = 15;
  var padBot = 5;
  var usableW = chartW - padX * 2;
  var usableH = chartH - padTop - padBot;

  /* Calculate points */
  var points = data.map(function(d, i) {
    var x = padX + (i / (data.length - 1)) * usableW;
    var y = padTop + usableH - ((d.value - minVal + 5) / (maxVal - minVal + 10)) * usableH;
    return { x: x, y: y, d: d };
  });

  /* Smooth path using cardinal spline approximation */
  var linePath = 'M' + points.map(function(p) { return p.x + ',' + p.y; }).join(' L');
  var areaPath = linePath + ' L' + points[points.length-1].x + ',' + (chartH - padBot) +
    ' L' + points[0].x + ',' + (chartH - padBot) + ' Z';

  /* Build circles + tooltips */
  var dots = points.map(function(p, i) {
    var isLast = (i === points.length - 1);
    var color = isLast ? 'var(--color-danger)' : 'var(--color-primary)';
    var r = isLast ? 5 : 3.5;
    return '<circle cx="' + p.x + '" cy="' + p.y + '" r="' + r + '" fill="' + color + '" ' +
      'class="trend-dot" data-tip="' + p.d.week + ': ' + p.d.value + ' patients">' +
      '<animate attributeName="r" from="0" to="' + r + '" dur="0.4s" begin="' + (0.3 + i * 0.08) + 's" fill="freeze"/>' +
      '</circle>' +
      /* Value label for last point */
      (isLast ? '<text x="' + p.x + '" y="' + (p.y - 10) + '" text-anchor="middle" ' +
        'font-size="11" font-weight="600" fill="var(--color-danger)">' + p.d.value + '</text>' : '');
  }).join('');

  /* Horizontal grid lines */
  var gridLines = '';
  for (var g = 0; g <= 3; g++) {
    var gy = padTop + (g / 3) * usableH;
    gridLines += '<line x1="' + padX + '" y1="' + gy + '" x2="' + (chartW - padX) + '" y2="' + gy + '" ' +
      'stroke="var(--color-border-light)" stroke-width="1" stroke-dasharray="4,4"/>';
  }

  var chartEl = document.getElementById('trend-chart');
  chartEl.innerHTML =
    '<svg viewBox="0 0 ' + chartW + ' ' + chartH + '" preserveAspectRatio="none" class="trend-svg">' +
      '<defs>' +
        '<linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0%" stop-color="var(--color-primary)" stop-opacity="0.25"/>' +
          '<stop offset="100%" stop-color="var(--color-primary)" stop-opacity="0.02"/>' +
        '</linearGradient>' +
      '</defs>' +
      gridLines +
      '<path d="' + areaPath + '" fill="url(#areaGrad)" class="trend-area"/>' +
      '<path d="' + linePath + '" fill="none" stroke="var(--color-primary)" stroke-width="2.5" ' +
        'stroke-linecap="round" stroke-linejoin="round" class="trend-line" ' +
        'stroke-dasharray="600" stroke-dashoffset="600">' +
        '<animate attributeName="stroke-dashoffset" from="600" to="0" dur="1.2s" fill="freeze"/>' +
      '</path>' +
      dots +
    '</svg>';

  /* Week labels */
  var labelsEl = document.getElementById('trend-labels');
  labelsEl.innerHTML = data.map(function(d) {
    return '<span>' + d.week + '</span>';
  }).join('');
};
