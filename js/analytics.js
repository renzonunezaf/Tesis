/**
 * ==========================================================
 * ANALYTICS MODULE
 * Renders population-level risk segmentation cards.
 * ==========================================================
 */
EnaraApp.renderAnalytics = function() {
  var container = document.getElementById('analytics-grid');

  container.innerHTML = EnaraApp.SEGMENTS.map(function(seg) {
    var rows = seg.items.map(function(item) {
      var color = item.p >= 40 ? 'var(--color-danger)' :
                  item.p >= 30 ? 'var(--color-warning)' : 'var(--color-success)';
      return '<div class="segment-row">' +
        '<div class="segment-label">' + item.l + '</div>' +
        '<div class="segment-track"><div class="segment-fill" style="width:' + item.p + '%;background:' + color + '"></div></div>' +
        '<div class="segment-pct" style="color:' + color + '">' + item.p + '%</div>' +
      '</div>';
    }).join('');

    return '<div class="analytics-card"><h4 class="analytics-card__title">' + seg.title + '</h4>' + rows + '</div>';
  }).join('');
};
