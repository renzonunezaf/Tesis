/**
 * ANALYTICS MODULE v3 — Rich visual redesign
 */
EnaraApp.renderAnalytics = function() {
  var container = document.getElementById('analytics-grid');
  if (!container) return;

  /* ── Page header ── */
  var headerHTML =
    '<div class="analytics-header">' +
      '<div>' +
        '<div class="analytics-headline">Population <span>Risk</span> Insights</div>' +
        '<div class="analytics-tagline">Dropout probability across 9 dimensions · 1,247 active patients · RF-SHAP v2.4</div>' +
      '</div>' +
    '</div>';

  /* ── Summary bar ── */
  var summaryHTML = '<div class="analytics-summary-bar">' +
    '<div class="asb-card"><div class="asb-icon asb-icon--danger">🔴</div><div><div class="asb-value" style="color:var(--color-danger)">45%</div><div class="asb-label">Highest risk segment<br>0–4 wk program stage</div></div></div>' +
    '<div class="asb-card"><div class="asb-icon asb-icon--warning">📊</div><div><div class="asb-value" style="color:var(--color-warning)">54%</div><div class="asb-label">Low-engagement dropout<br>vs 12% high-engagement</div></div></div>' +
    '<div class="asb-card"><div class="asb-icon asb-icon--success">✅</div><div><div class="asb-value" style="color:var(--color-success)">21%</div><div class="asb-label">Lowest risk segment<br>Clinic-linked modality</div></div></div>' +
    '<div class="asb-card"><div class="asb-icon asb-icon--primary">💡</div><div><div class="asb-value" style="color:var(--color-primary)">9</div><div class="asb-label">Risk segments analyzed<br>across 6 dimensions</div></div></div>' +
  '</div>';

  /* ── Insight callouts ── */
  var insightHTML = '<div class="analytics-section-title">Key Takeaways</div>' +
    '<div class="insight-strip">' +
      '<div class="insight-card insight-card--danger"><div class="insight-card__label">⚠ Highest Risk</div><div class="insight-card__text">Patients in <strong>0–4 weeks</strong> of the program carry a <strong>45% dropout risk</strong>. Early engagement is the single strongest lever.</div></div>' +
      '<div class="insight-card insight-card--warning"><div class="insight-card__label">📌 Watch Group</div><div class="insight-card__text"><strong>Low-engagement patients</strong> are 4.5× more likely to drop out than high-engagement ones (54% vs 12%).</div></div>' +
      '<div class="insight-card insight-card--success"><div class="insight-card__label">✨ Bright Spot</div><div class="insight-card__text"><strong>GLP-1 supported</strong> patients and <strong>clinic-linked</strong> modality show consistently the lowest dropout risk.</div></div>' +
    '</div>';

  /* ── Heatmap: Risk × Stage × Modality ── */
  var heatmapHTML = '<div class="analytics-section-title">Risk Heatmap — Program Stage × Modality</div>' +
    '<div class="heatmap-section"><div class="heatmap-wrap"><table class="heatmap-table">' +
    '<thead><tr><th>Stage</th><th>Virtual</th><th>Hybrid</th><th>Clinic-Linked</th><th>Avg</th></tr></thead><tbody>';

  var hmData = [
    { stage: '0–4 weeks',   v: 48, h: 43, c: 38 },
    { stage: '5–12 weeks',  v: 37, h: 31, c: 26 },
    { stage: '13–24 weeks', v: 29, h: 24, c: 20 },
    { stage: '25+ weeks',   v: 20, h: 17, c: 14 }
  ];

  function heatColor(val) {
    if (val >= 40) return { bg: 'rgba(229,62,62,0.75)',  cls: '' };
    if (val >= 30) return { bg: 'rgba(221,107,32,0.75)', cls: '' };
    if (val >= 20) return { bg: 'rgba(236,201,75,0.75)', cls: '' };
    return { bg: 'rgba(72,187,120,0.75)', cls: '' };
  }

  hmData.forEach(function(row) {
    var avg = Math.round((row.v + row.h + row.c) / 3);
    var c = { v: heatColor(row.v), h: heatColor(row.h), c: heatColor(row.c), avg: heatColor(avg) };
    heatmapHTML += '<tr>' +
      '<td>' + row.stage + '</td>' +
      '<td><span class="heatmap-cell" style="background:' + c.v.bg + '">' + row.v + '%</span></td>' +
      '<td><span class="heatmap-cell" style="background:' + c.h.bg + '">' + row.h + '%</span></td>' +
      '<td><span class="heatmap-cell" style="background:' + c.c.bg + '">' + row.c + '%</span></td>' +
      '<td><span class="heatmap-cell" style="background:' + c.avg.bg + '">' + avg + '%</span></td>' +
    '</tr>';
  });
  heatmapHTML += '</tbody></table></div></div>';

  /* ── Bubble: Risk by engagement ── */
  var engagementData = [
    { l: 'High', p: 12,  n: 310 },
    { l: 'Medium', p: 31, n: 560 },
    { l: 'Low', p: 54,   n: 377 }
  ];
  var maxBubble = 80;
  var bubbleCols = engagementData.map(function(d) {
    var sz = 30 + (d.p / 54) * 50;
    var color = d.p >= 40 ? 'var(--color-danger)' : d.p >= 25 ? 'var(--color-warning)' : 'var(--color-success)';
    return '<div class="bubble-col">' +
      '<div class="bubble" style="width:' + sz + 'px;height:' + sz + 'px;background:' + color + '">' + d.p + '%</div>' +
      '<div class="bubble-label">' + d.l + '<br><span style="color:var(--color-text-muted);font-size:0.58rem;">n=' + d.n + '</span></div>' +
    '</div>';
  }).join('');

  var bubbleHTML = '<div class="bubble-panel">' +
    '<div class="bubble-panel__title">Risk by Engagement Level</div>' +
    '<div class="bubble-panel__sub">Bubble size proportional to dropout probability</div>' +
    '<div class="bubble-canvas">' + bubbleCols + '</div>' +
  '</div>';

  /* ── Donut: Distribution ── */
  var distData = [
    { label: 'Critical', count: 12,   color: '#E53E3E', pct: 1 },
    { label: 'High',     count: 26,   color: '#DD6B20', pct: 2 },
    { label: 'Medium',   count: 58,   color: '#D69E2E', pct: 5 },
    { label: 'Low',      count: 1151, color: '#48BB78', pct: 92 }
  ];
  var total = 1247;

  // Build SVG donut
  var cx = 70, cy = 70, r = 54, stroke = 18;
  var circumference = 2 * Math.PI * r;
  var offset = 0;
  var donutSegments = '';
  distData.forEach(function(d) {
    var pct = d.count / total;
    var dasharray = pct * circumference;
    var dashoffset = circumference - offset * circumference;
    donutSegments += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="' + d.color + '" stroke-width="' + stroke + '" stroke-dasharray="' + dasharray.toFixed(2) + ' ' + (circumference - dasharray).toFixed(2) + '" stroke-dashoffset="' + (circumference * 0.25).toFixed(2) + '" transform="rotate(' + (offset * 360 - 90) + ' ' + cx + ' ' + cy + ')" stroke-linecap="butt"/>';
    offset += pct;
  });

  var legendItems = distData.map(function(d) {
    return '<div class="donut-legend-item">' +
      '<div class="donut-legend-dot" style="background:' + d.color + '"></div>' +
      '<div class="donut-legend-label">' + d.label + '</div>' +
      '<div class="donut-legend-val">' + d.count + '</div>' +
      '<div class="donut-legend-pct">(' + d.pct + '%)</div>' +
    '</div>';
  }).join('');

  var donutHTML = '<div class="donut-panel">' +
    '<div class="donut-panel__title">Risk Distribution</div>' +
    '<div class="donut-panel__sub">1,247 active patients by dropout tier</div>' +
    '<div class="donut-body">' +
      '<div class="donut-svg-wrap">' +
        '<svg width="140" height="140" viewBox="0 0 140 140">' + donutSegments + '</svg>' +
        '<div class="donut-center"><div class="donut-center-value">1,247</div><div class="donut-center-label">patients</div></div>' +
      '</div>' +
      '<div class="donut-legend">' + legendItems + '</div>' +
    '</div>' +
  '</div>';

  /* ── Row: bubble + donut ── */
  var row2HTML = '<div class="analytics-section-title">Distribution & Engagement</div>' +
    '<div class="analytics-row-2">' + bubbleHTML + donutHTML + '</div>';

  /* ── Segment bar cards ── */
  var segmentsHTML = '<div class="analytics-section-title">Risk by Segment</div>' +
    '<div class="radar-section">';

  var icons = ['👥', '🏥', '💊', '📱', '🗺️', '⏱️', '⚧', '🤝'];
  EnaraApp.SEGMENTS.slice(0, 8).forEach(function(seg, i) {
    var rows = seg.items.map(function(item) {
      var color = item.p >= 40 ? 'var(--color-danger)' :
                  item.p >= 30 ? 'var(--color-warning)' :
                  item.p >= 20 ? 'var(--color-caution)' : 'var(--color-success)';
      return '<div class="seg-row">' +
        '<div class="seg-label">' + item.l + '</div>' +
        '<div class="seg-track"><div class="seg-fill" style="background:' + color + '" data-pct="' + item.p + '"></div></div>' +
        '<div class="seg-pct" style="color:' + color + '">' + item.p + '%</div>' +
      '</div>';
    }).join('');
    segmentsHTML += '<div class="segment-card">' +
      '<div class="segment-card__title"><span>' + (icons[i] || '📊') + '</span>' + seg.title + '</div>' +
      rows + '</div>';
  });
  segmentsHTML += '</div>';

  container.innerHTML = headerHTML + summaryHTML + insightHTML + heatmapHTML + row2HTML + segmentsHTML;

  /* Animate segment bars */
  requestAnimationFrame(function() {
    setTimeout(function() {
      container.querySelectorAll('.seg-fill').forEach(function(el) {
        var pct = el.getAttribute('data-pct');
        if (pct) el.style.width = pct + '%';
      });
    }, 80);
  });
};
