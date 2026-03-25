/**
 * ==========================================================
 * KPI MODULE v2
 * Renders metric cards with animated SVG ring charts.
 * ==========================================================
 */
EnaraApp.renderKPIs = function() {
  var container = document.getElementById('kpi-row');

  container.innerHTML = EnaraApp.KPI_DATA.map(function(kpi, i) {
    var heroClass = kpi.hero ? ' kpi--hero' : '';
    var ringColor = kpi.hero ? '#fff' : kpi.ringColor || 'var(--color-primary)';
    var pct = kpi.ringPct || 0;

    /* SVG ring math: circumference = 2 * PI * r, r = 20 */
    var circ = 2 * Math.PI * 20;
    var offset = circ - (circ * pct / 100);

    var ring = '<div class="kpi__ring">' +
      '<svg viewBox="0 0 48 48">' +
        '<circle class="kpi__ring-bg" cx="24" cy="24" r="20"></circle>' +
        '<circle class="kpi__ring-fill" cx="24" cy="24" r="20" ' +
          'stroke="' + ringColor + '" ' +
          'stroke-dasharray="' + circ.toFixed(1) + '" ' +
          'stroke-dashoffset="' + circ.toFixed(1) + '" ' +
          'data-target="' + offset.toFixed(1) + '"></circle>' +
      '</svg>' +
      '<div class="kpi__ring-label">' + (kpi.ringLabel || '') + '</div>' +
    '</div>';

    return '<div class="kpi' + heroClass + '" style="animation-delay:' + (i * 60) + 'ms">' +
      '<div class="kpi__tooltip">' + kpi.tooltip + '</div>' +
      ring +
      '<div class="kpi__info">' +
        '<div class="kpi__label">' + kpi.label + '</div>' +
        '<div class="kpi__value">' + kpi.value + '</div>' +
        '<div class="kpi__delta ' + kpi.cls + '">' + kpi.delta + '</div>' +
      '</div>' +
    '</div>';
  }).join('');

  /* Animation triggered by EnaraApp.animateKPIRings() — called from views.js on each switch */
};
