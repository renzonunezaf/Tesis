/**
 * ==========================================================
 * ANALYTICS MODULE v3
 * Diverse SVG chart types for population risk segmentation:
 * - Funnel chart (Program Stage)
 * - Radar chart (multi-dimensional risk profile)
 * - Ring gauges (Med Track, Modality)
 * - Side-by-side comparison (Sex)
 * - Heatmap (Stage × Modality)
 * - Horizontal bars (Age, State, Insurer, Clinic)
 * - Engagement gradient bars
 * - Bubble chart (clinic population)
 * All charts animate on view switch via animateAnalytics().
 * ==========================================================
 */

/**
 * @param {Array} segments - Segment data from api.getSegments()
 */
EnaraApp.renderAnalytics = function(segments) {
  var container = document.getElementById('analytics-grid');
  if (!container) return;

  /* Index segments by key for easy access */
  var segs = {};
  segments.forEach(function(s) {
    var key = s.title.replace('Risk by ', '').replace(/ /g, '_').toLowerCase();
    segs[key] = s;
  });

  var html = '';

  /* ── Header ── */
  html += '<div class="ana-header">' +
    '<div class="ana-headline">Risk <span>Insights</span></div>' +
    '<div class="ana-tagline">Population-level risk segmentation · 1,247 active patients · RF-SHAP v2.4</div>' +
  '</div>';

  /* ── Row 1: Funnel + Radar ── */
  html += '<div class="ana-row ana-row--2col">' +
    '<div class="ana-card ana-card--tall">' +
      '<div class="ana-card__title">Risk by Program Stage</div>' +
      '<div class="ana-card__sub">Dropout risk decreases with tenure — early weeks are critical</div>' +
      '<div class="ana-funnel" id="ana-funnel"></div>' +
    '</div>' +
    '<div class="ana-card ana-card--tall">' +
      '<div class="ana-card__title">Highest-Risk Dimensions</div>' +
      '<div class="ana-card__sub">Overlay of top risk factors across all segments</div>' +
      '<div class="ana-radar" id="ana-radar"></div>' +
    '</div>' +
  '</div>';

  /* ── Row 2: Med Track rings + Modality rings + Sex compare ── */
  html += '<div class="ana-row ana-row--3col">' +
    '<div class="ana-card">' +
      '<div class="ana-card__title">Risk by Medication Track</div>' +
      '<div class="ana-rings" id="ana-rings-med"></div>' +
    '</div>' +
    '<div class="ana-card">' +
      '<div class="ana-card__title">Risk by Modality</div>' +
      '<div class="ana-rings" id="ana-rings-mod"></div>' +
    '</div>' +
    '<div class="ana-card">' +
      '<div class="ana-card__title">Risk by Sex</div>' +
      '<div class="ana-compare" id="ana-compare-sex"></div>' +
    '</div>' +
  '</div>';

  /* ── Row 3: Heatmap + Engagement ── */
  html += '<div class="ana-row ana-row--2col">' +
    '<div class="ana-card">' +
      '<div class="ana-card__title">Risk Heatmap: Stage × Modality</div>' +
      '<div class="ana-card__sub">Average dropout risk % per cell</div>' +
      '<div class="ana-heatmap" id="ana-heatmap"></div>' +
    '</div>' +
    '<div class="ana-card">' +
      '<div class="ana-card__title">Risk by Engagement Level</div>' +
      '<div class="ana-card__sub">Strong inverse correlation with engagement</div>' +
      '<div class="ana-engage-bars" id="ana-engage"></div>' +
    '</div>' +
  '</div>';

  /* ── Row 4: Bar chart grid ── */
  html += '<div class="ana-row ana-row--3col">';
  ['age_range', 'insurer', 'state'].forEach(function(key) {
    html += EnaraApp._buildBarCard(segs[key]);
  });
  html += '</div>';

  /* ── Row 5: Clinic bars + Bubble ── */
  html += '<div class="ana-row ana-row--2col">' +
    EnaraApp._buildBarCard(segs['clinic']) +
    '<div class="ana-card">' +
      '<div class="ana-card__title">Clinic Population Map</div>' +
      '<div class="ana-card__sub">Size = patient count · color = avg risk</div>' +
      '<div class="ana-bubbles" id="ana-bubbles"></div>' +
    '</div>' +
  '</div>';

  container.innerHTML = html;

  /* ── Render SVG sub-components ── */
  EnaraApp._renderFunnel(segs['program_stage']);
  EnaraApp._renderRadar();
  EnaraApp._renderRings('ana-rings-med', segs['med_track']);
  EnaraApp._renderRings('ana-rings-mod', segs['modality']);
  EnaraApp._renderSexCompare(segs['sex']);
  EnaraApp._renderHeatmap();
  EnaraApp._renderEngageBars(segs['engagement']);
  EnaraApp._renderBubbles();
};

/* ── Horizontal bar card (reusable) ── */
EnaraApp._buildBarCard = function(seg) {
  if (!seg) return '';
  var rows = seg.items.map(function(item) {
    var color = item.p >= 40 ? 'var(--color-danger)' :
                item.p >= 30 ? 'var(--color-warning)' : 'var(--color-success)';
    return '<div class="ana-bar-row">' +
      '<div class="ana-bar-label">' + item.l + '</div>' +
      '<div class="ana-bar-track"><div class="ana-bar-fill seg-fill" data-pct="' + item.p + '" style="background:' + color + '"></div></div>' +
      '<div class="ana-bar-pct" style="color:' + color + '">' + item.p + '%</div>' +
    '</div>';
  }).join('');
  return '<div class="ana-card"><div class="ana-card__title">' + seg.title + '</div>' + rows + '</div>';
};

/* ── Funnel SVG ── */
EnaraApp._renderFunnel = function(seg) {
  if (!seg) return;
  var el = document.getElementById('ana-funnel');
  var items = seg.items;
  var W = 340, H = 200, padY = 8, gap = 10;
  var barH = (H - padY * 2 - gap * (items.length - 1)) / items.length;
  var maxPct = Math.max.apply(null, items.map(function(i) { return i.p; }));

  var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" class="ana-funnel-svg">';
  items.forEach(function(item, i) {
    var y = padY + i * (barH + gap);
    var w = 60 + (item.p / maxPct) * 180;
    var x = (W - w) / 2;
    var color = item.p >= 40 ? 'var(--color-danger)' :
                item.p >= 30 ? 'var(--color-warning)' : 'var(--color-success)';

    svg += '<rect class="funnel-bar" x="' + x + '" y="' + y + '" width="0" height="' + barH + '" rx="' + (barH/2) + '" ' +
      'fill="' + color + '" opacity="' + (0.5 + i * 0.15) + '" data-target-w="' + w + '"/>';
    svg += '<text x="' + (x - 8) + '" y="' + (y + barH/2 + 4) + '" text-anchor="end" font-size="11" font-weight="500" fill="var(--color-text-secondary)">' + item.l + '</text>';
    svg += '<text x="' + (W/2) + '" y="' + (y + barH/2 + 5) + '" text-anchor="middle" font-size="14" font-weight="700" fill="var(--color-card)">' + item.p + '%</text>';
  });
  svg += '</svg>';
  el.innerHTML = svg;
};

/* ── Radar SVG ── */
EnaraApp._renderRadar = function() {
  var el = document.getElementById('ana-radar');
  var dims = EnaraApp.RADAR_DIMENSIONS;
  var n = dims.length, cx = 140, cy = 110, R = 80;

  var svg = '<svg viewBox="0 0 280 220" class="ana-radar-svg">';

  /* Grid rings */
  [0.25, 0.5, 0.75, 1.0].forEach(function(pct) {
    var pts = [];
    for (var i = 0; i < n; i++) {
      var a = (Math.PI * 2 * i / n) - Math.PI / 2;
      pts.push((cx + R * pct * Math.cos(a)).toFixed(1) + ',' + (cy + R * pct * Math.sin(a)).toFixed(1));
    }
    svg += '<polygon points="' + pts.join(' ') + '" fill="none" stroke="var(--color-border-light)" stroke-width="1"/>';
  });

  /* Axes + labels */
  for (var i = 0; i < n; i++) {
    var a = (Math.PI * 2 * i / n) - Math.PI / 2;
    svg += '<line x1="' + cx + '" y1="' + cy + '" x2="' + (cx + R * Math.cos(a)) + '" y2="' + (cy + R * Math.sin(a)) + '" stroke="var(--color-border)" stroke-width="0.5"/>';
    var lx = cx + (R + 20) * Math.cos(a), ly = cy + (R + 20) * Math.sin(a);
    var anch = Math.abs(Math.cos(a)) < 0.15 ? 'middle' : Math.cos(a) > 0 ? 'start' : 'end';
    svg += '<text x="' + lx + '" y="' + (ly + 3) + '" text-anchor="' + anch + '" font-size="9" fill="var(--color-text-muted)">' + dims[i].label + '</text>';
  }

  /* Data polygon */
  var dpts = [];
  for (var j = 0; j < n; j++) {
    var aj = (Math.PI * 2 * j / n) - Math.PI / 2;
    var rj = (dims[j].value / 60) * R;
    dpts.push((cx + rj * Math.cos(aj)).toFixed(1) + ',' + (cy + rj * Math.sin(aj)).toFixed(1));
  }
  svg += '<polygon points="' + dpts.join(' ') + '" fill="rgba(229,62,62,0.12)" stroke="var(--color-danger)" stroke-width="2" class="radar-polygon" stroke-linejoin="round"/>';

  /* Dots */
  for (var k = 0; k < n; k++) {
    var ak = (Math.PI * 2 * k / n) - Math.PI / 2;
    var rkk = (dims[k].value / 60) * R;
    svg += '<circle cx="' + (cx + rkk * Math.cos(ak)) + '" cy="' + (cy + rkk * Math.sin(ak)) + '" r="4" fill="var(--color-danger)" stroke="var(--color-card)" stroke-width="2" class="radar-dot"/>';
  }
  svg += '</svg>';
  el.innerHTML = svg;
};

/* ── Ring gauges ── */
EnaraApp._renderRings = function(id, seg) {
  if (!seg) return;
  var el = document.getElementById(id);
  el.innerHTML = seg.items.map(function(item) {
    var r = 28, circ = 2 * Math.PI * r;
    var pct = item.p / 60;
    var offset = circ - pct * circ;
    var color = item.p >= 40 ? 'var(--color-danger)' : item.p >= 30 ? 'var(--color-warning)' : 'var(--color-success)';
    return '<div class="ana-ring-item"><svg width="72" height="72" viewBox="0 0 72 72">' +
      '<circle cx="36" cy="36" r="' + r + '" fill="none" stroke="var(--color-border-light)" stroke-width="6"/>' +
      '<circle cx="36" cy="36" r="' + r + '" fill="none" stroke="' + color + '" stroke-width="6" stroke-linecap="round" ' +
        'stroke-dasharray="' + circ.toFixed(1) + '" stroke-dashoffset="' + circ.toFixed(1) + '" transform="rotate(-90 36 36)" ' +
        'class="ana-ring-fill" data-target="' + offset.toFixed(1) + '"/>' +
      '<text x="36" y="34" text-anchor="middle" font-size="15" font-weight="700" fill="' + color + '">' + item.p + '</text>' +
      '<text x="36" y="44" text-anchor="middle" font-size="8" fill="var(--color-text-muted)">%</text>' +
    '</svg><div class="ana-ring-label">' + item.l + '</div></div>';
  }).join('');
};

/* ── Sex comparison ── */
EnaraApp._renderSexCompare = function(seg) {
  if (!seg) return;
  var el = document.getElementById('ana-compare-sex');
  var a = seg.items[0], b = seg.items[1];
  el.innerHTML =
    '<div class="ana-sex-row">' +
      '<div class="ana-sex-side"><div class="ana-sex-value" style="color:var(--color-secondary)">' + a.p + '%</div><div class="ana-sex-label">' + a.l + '</div>' +
        '<div class="ana-sex-bar-track"><div class="ana-sex-bar seg-fill" data-pct="' + (a.p/60*100).toFixed(0) + '" style="background:var(--color-secondary)"></div></div></div>' +
      '<div class="ana-sex-divider">vs</div>' +
      '<div class="ana-sex-side"><div class="ana-sex-value" style="color:var(--color-primary)">' + b.p + '%</div><div class="ana-sex-label">' + b.l + '</div>' +
        '<div class="ana-sex-bar-track"><div class="ana-sex-bar seg-fill" data-pct="' + (b.p/60*100).toFixed(0) + '" style="background:var(--color-primary)"></div></div></div>' +
    '</div>' +
    '<div class="ana-sex-delta"><span>Gap: ' + Math.abs(a.p - b.p) + ' percentage points</span></div>';
};

/* ── Heatmap ── */
EnaraApp._renderHeatmap = function() {
  var hm = EnaraApp.HEATMAP_DATA;
  if (!hm) return;
  var el = document.getElementById('ana-heatmap');
  function cc(v) { return v >= 45 ? 'var(--color-danger)' : v >= 35 ? 'var(--color-warning)' : v >= 25 ? 'var(--color-caution)' : 'var(--color-success)'; }
  var h = '<div class="hm-row hm-row--header"><div class="hm-corner"></div>' +
    hm.cols.map(function(c) { return '<div class="hm-col-label">' + c + '</div>'; }).join('') + '</div>';
  h += hm.rows.map(function(rl, ri) {
    return '<div class="hm-row"><div class="hm-row-label">' + rl + '</div>' +
      hm.values[ri].map(function(v) { return '<div class="hm-cell heatmap-cell" style="background:' + cc(v) + ';opacity:0">' + v + '%</div>'; }).join('') + '</div>';
  }).join('');
  el.innerHTML = h;
};

/* ── Engagement bars ── */
EnaraApp._renderEngageBars = function(seg) {
  if (!seg) return;
  var el = document.getElementById('ana-engage');
  var maxP = Math.max.apply(null, seg.items.map(function(i) { return i.p; }));
  el.innerHTML = seg.items.map(function(item) {
    var pct = (item.p / maxP) * 100;
    var color = item.l === 'High' ? 'var(--color-success)' : item.l === 'Medium' ? 'var(--color-caution)' : 'var(--color-danger)';
    return '<div class="ana-engage-row"><div class="ana-engage-label">' + item.l + '</div>' +
      '<div class="ana-engage-track"><div class="ana-engage-fill seg-fill" data-pct="' + pct.toFixed(0) + '" style="background:' + color + '"></div></div>' +
      '<div class="ana-engage-val" style="color:' + color + '">' + item.p + '%</div></div>';
  }).join('');
};

/* ── Bubble chart ── */
EnaraApp._renderBubbles = function() {
  var el = document.getElementById('ana-bubbles');
  var data = [
    { l:'West LA',risk:26,n:180 },{ l:'Houston',risk:35,n:220 },{ l:'NYC',risk:28,n:290 },
    { l:'Miami',risk:32,n:170 },{ l:'SF',risk:30,n:200 },{ l:'Chicago',risk:33,n:150 },{ l:'Seattle',risk:24,n:90 }
  ];
  var W = 340, H = 160;
  var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" class="ana-bubble-svg">';
  data.forEach(function(d, i) {
    var r = Math.sqrt(d.n) * 0.6;
    var cx = 30 + (i / (data.length - 1)) * (W - 60);
    var cy = H / 2 + Math.sin(i * 1.3) * 20;
    var color = d.risk >= 33 ? 'var(--color-danger)' : d.risk >= 28 ? 'var(--color-warning)' : 'var(--color-success)';
    svg += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + color + '" opacity="0.25" class="bubble"/>';
    svg += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r*0.55) + '" fill="' + color + '" opacity="0.5" class="bubble"/>';
    svg += '<text x="' + cx + '" y="' + (cy+3) + '" text-anchor="middle" font-size="9" font-weight="700" fill="var(--color-card)" class="bubble-label">' + d.risk + '%</text>';
    svg += '<text x="' + cx + '" y="' + (cy+r+14) + '" text-anchor="middle" font-size="8" fill="var(--color-text-muted)">' + d.l + '</text>';
  });
  svg += '</svg>';
  el.innerHTML = svg;
};

/* ── Master animation trigger ── */
EnaraApp.animateAnalytics = function(container) {
  var root = container || document;

  /* Reset all animated elements */
  root.querySelectorAll('.seg-fill[data-pct]').forEach(function(el) { el.style.transition='none'; el.style.width='0%'; });
  root.querySelectorAll('.ana-ring-fill').forEach(function(r) { r.style.transition='none'; r.style.strokeDashoffset=(2*Math.PI*28).toFixed(1); });
  root.querySelectorAll('.funnel-bar').forEach(function(b) { b.style.transition='none'; b.setAttribute('width','0'); });
  root.querySelectorAll('.heatmap-cell').forEach(function(el) { el.style.transition='none'; el.style.opacity='0'; el.style.transform='scale(0.7)'; });
  root.querySelectorAll('.bubble,.bubble-label').forEach(function(el) { el.style.transition='none'; el.style.opacity='0'; el.style.transform='scale(0)'; });
  var poly = root.querySelector('.radar-polygon');
  if (poly) { poly.style.transition='none'; poly.style.opacity='0'; poly.style.transform='scale(0.3)'; poly.style.transformOrigin='center'; }
  root.querySelectorAll('.radar-dot').forEach(function(d) { d.style.transition='none'; d.style.opacity='0'; });

  requestAnimationFrame(function() { requestAnimationFrame(function() {
    root.querySelectorAll('.seg-fill[data-pct]').forEach(function(el, i) {
      el.style.transition='width 0.8s cubic-bezier(0.4,0,0.2,1) '+(i*40)+'ms'; el.style.width=el.getAttribute('data-pct')+'%'; });
    root.querySelectorAll('.ana-ring-fill').forEach(function(r, i) {
      r.style.transition='stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1) '+(i*120)+'ms'; r.style.strokeDashoffset=r.dataset.target; });
    root.querySelectorAll('.funnel-bar').forEach(function(b, i) {
      b.style.transition='width 0.8s cubic-bezier(0.4,0,0.2,1) '+(i*150)+'ms'; b.setAttribute('width', b.getAttribute('data-target-w')); });
    root.querySelectorAll('.heatmap-cell').forEach(function(el, i) {
      el.style.transition='opacity 0.4s ease '+(i*60)+'ms, transform 0.4s cubic-bezier(0.34,1.56,0.64,1) '+(i*60)+'ms'; el.style.opacity='1'; el.style.transform='scale(1)'; });
    root.querySelectorAll('.bubble').forEach(function(el, i) {
      el.style.transition='opacity 0.5s ease '+(200+i*80)+'ms, transform 0.6s cubic-bezier(0.34,1.56,0.64,1) '+(200+i*80)+'ms'; el.style.opacity='1'; el.style.transform='scale(1)'; });
    root.querySelectorAll('.bubble-label').forEach(function(el, i) {
      el.style.transition='opacity 0.3s ease '+(500+i*80)+'ms'; el.style.opacity='1'; el.style.transform='scale(1)'; });
    if (poly) { poly.style.transition='opacity 0.8s ease 0.2s, transform 0.8s cubic-bezier(0.34,1.56,0.64,1) 0.2s'; poly.style.opacity='1'; poly.style.transform='scale(1)'; }
    root.querySelectorAll('.radar-dot').forEach(function(d, i) {
      d.style.transition='opacity 0.3s ease '+(600+i*100)+'ms'; d.style.opacity='1'; });
  }); });
};
