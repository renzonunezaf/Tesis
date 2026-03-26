/**
 * ==========================================================
 * CHARTS MODULE v3
 * SVG-based area chart with interactive hover tooltips and
 * crosshair, animated distribution bars.
 * ==========================================================
 */

/* ----- Risk Distribution: Animated horizontal bars ----- */
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

  /* Animation triggered by EnaraApp.animateDistBars() — called from views.js */
};

/* ----- Trend: Interactive SVG area chart with tooltip + crosshair ----- */
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

  var linePath = 'M' + points.map(function(p) { return p.x + ',' + p.y; }).join(' L');
  var areaPath = linePath + ' L' + points[points.length-1].x + ',' + (chartH - padBot) +
    ' L' + points[0].x + ',' + (chartH - padBot) + ' Z';

  /* Dots with stroke halos */
  var dots = points.map(function(p, i) {
    var isLast = (i === points.length - 1);
    var color = isLast ? 'var(--color-danger)' : 'var(--color-primary)';
    var r = isLast ? 5 : 3.5;
    return '<circle cx="' + p.x + '" cy="' + p.y + '" r="' + r + '" fill="' + color + '" ' +
      'stroke="var(--color-card)" stroke-width="2" ' +
      'class="trend-dot" data-idx="' + i + '"/>' +
      (isLast ? '<text x="' + p.x + '" y="' + (p.y - 10) + '" text-anchor="middle" ' +
        'font-size="11" font-weight="600" fill="var(--color-danger)">' + p.d.value + '</text>' : '');
  }).join('');

  /* Invisible hit rectangles for precise hover */
  var hitAreas = points.map(function(p, i) {
    return '<rect x="' + (p.x - 20) + '" y="0" width="40" height="' + chartH + '" ' +
      'fill="transparent" class="trend-hit" data-idx="' + i + '" style="cursor:pointer"/>';
  }).join('');

  /* Grid lines */
  var gridLines = '';
  for (var g = 0; g <= 3; g++) {
    var gy = padTop + (g / 3) * usableH;
    gridLines += '<line x1="' + padX + '" y1="' + gy + '" x2="' + (chartW - padX) + '" y2="' + gy + '" ' +
      'stroke="var(--color-border-light)" stroke-width="1" stroke-dasharray="4,4"/>';
  }

  var chartEl = document.getElementById('trend-chart');
  chartEl.style.position = 'relative';
  chartEl.innerHTML =
    '<div class="chart-tooltip" id="trend-tooltip"></div>' +
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
        'stroke-linecap="round" stroke-linejoin="round" class="trend-line" id="trend-line-path" ' +
        'stroke-dasharray="600" stroke-dashoffset="600"/>' +
      '<line id="trend-crosshair" x1="0" y1="' + padTop + '" x2="0" y2="' + (chartH - padBot) + '" ' +
        'stroke="var(--color-primary)" stroke-width="1" stroke-dasharray="3,3" opacity="0"/>' +
      dots +
      hitAreas +
    '</svg>';

  /* Week labels */
  var labelsEl = document.getElementById('trend-labels');
  labelsEl.innerHTML = data.map(function(d) {
    return '<span>' + d.week + '</span>';
  }).join('');

  /* Attach tooltip interactivity */
  EnaraApp._initTrendTooltips(chartEl, points, data, chartW, chartH);
};

/* ----- Trend tooltip handlers ----- */
EnaraApp._initTrendTooltips = function(chartEl, points, data, chartW, chartH) {
  var tooltip = document.getElementById('trend-tooltip');
  var crosshair = document.getElementById('trend-crosshair');

  chartEl.querySelectorAll('.trend-hit').forEach(function(hit) {
    hit.addEventListener('mouseenter', function() {
      var idx = parseInt(hit.dataset.idx, 10);
      var pt = points[idx];
      var prevVal = idx > 0 ? data[idx - 1].value : null;
      var delta = prevVal !== null ? (data[idx].value - prevVal) : 0;
      var deltaText = prevVal !== null
        ? ((delta >= 0 ? '+' : '') + delta + ' vs prev week')
        : '';

      /* Show crosshair */
      crosshair.setAttribute('x1', pt.x);
      crosshair.setAttribute('x2', pt.x);
      crosshair.style.opacity = '0.4';

      /* Tooltip content */
      tooltip.innerHTML =
        '<div class="chart-tooltip__value">' + pt.d.value + ' patients</div>' +
        '<div>' + pt.d.week + '</div>' +
        (deltaText ? '<div class="chart-tooltip__delta">' + deltaText + '</div>' : '');
      tooltip.classList.add('is-visible');

      /* Position tooltip above the point */
      var svgEl = chartEl.querySelector('svg');
      var svgRect = svgEl.getBoundingClientRect();
      var contRect = chartEl.getBoundingClientRect();
      var scaleX = svgRect.width / chartW;
      var scaleY = svgRect.height / chartH;
      var tipX = (pt.x * scaleX) + (svgRect.left - contRect.left);
      var tipY = (pt.y * scaleY) + (svgRect.top - contRect.top) - 50;
      tooltip.style.left = tipX + 'px';
      tooltip.style.top = tipY + 'px';
      tooltip.style.transform = 'translateX(-50%)';

      /* Enlarge dot */
      var dot = chartEl.querySelector('.trend-dot[data-idx="' + idx + '"]');
      if (dot) dot.setAttribute('r', '6');
    });

    hit.addEventListener('mouseleave', function() {
      crosshair.style.opacity = '0';
      tooltip.classList.remove('is-visible');
      var idx = parseInt(hit.dataset.idx, 10);
      var isLast = idx === points.length - 1;
      var dot = chartEl.querySelector('.trend-dot[data-idx="' + idx + '"]');
      if (dot) dot.setAttribute('r', isLast ? '5' : '3.5');
    });
  });
};

/* ----- Re-trigger trend line animation ----- */
EnaraApp.animateTrend = function() {
  var line = document.getElementById('trend-line-path');
  if (!line) return;
  line.style.transition = 'none';
  line.style.strokeDashoffset = '600';
  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      line.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
      line.style.strokeDashoffset = '0';
    });
  });

  /* Fade in dots */
  document.querySelectorAll('.trend-dot').forEach(function(dot, i) {
    dot.style.opacity = '0';
    setTimeout(function() {
      dot.style.transition = 'opacity 0.3s ease';
      dot.style.opacity = '1';
    }, 300 + i * 80);
  });
};
