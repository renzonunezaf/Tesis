/**
 * ==========================================================
 * TABLE MODULE v2
 * Patient intervention queue with mini ring gauges for risk
 * scores, sortable columns, and row selection.
 * ==========================================================
 */

/* ----- Build mini SVG ring gauge for risk score ----- */
EnaraApp.buildRiskGauge = function(risk, color) {
  var r = 14;
  var circ = 2 * Math.PI * r;
  var offset = circ - (circ * risk / 100);

  return '<div class="risk-gauge">' +
    '<div class="risk-gauge__ring">' +
      '<svg viewBox="0 0 36 36">' +
        '<circle class="risk-gauge__ring-bg" cx="18" cy="18" r="' + r + '"></circle>' +
        '<circle class="risk-gauge__ring-fill" cx="18" cy="18" r="' + r + '" ' +
          'stroke="' + color + '" ' +
          'stroke-dasharray="' + circ.toFixed(1) + '" ' +
          'stroke-dashoffset="' + offset.toFixed(1) + '"></circle>' +
      '</svg>' +
    '</div>' +
    '<div class="risk-gauge__score" style="color:' + color + '">' + risk + '%</div>' +
  '</div>';
};

/* ----- Render table rows ----- */
EnaraApp.renderTable = function() {
  var state = EnaraApp.state;
  var tbody = document.getElementById('table-body');

  tbody.innerHTML = state.filteredPatients.map(function(p, idx) {
    var isSelected = p.id === state.selectedPatientId ? 'is-selected' : '';
    var riskColor = EnaraApp.getRiskColor(p.risk);
    var riskBadge = EnaraApp.RISK_BADGE_CLASS[p.riskLevel];
    var priBadge  = EnaraApp.RISK_BADGE_CLASS[p.priority];
    var stsBadge  = EnaraApp.STATUS_BADGE_CLASS[p.status];

    /* Build risk gauge */
    var gauge = EnaraApp.buildRiskGauge(p.risk, riskColor);

    /* Days since: bold + red if > 14 */
    var daysStyle = p.daysSince > 14
      ? 'font-weight:600;color:var(--color-danger)'
      : 'color:var(--color-text-secondary)';

    /* Owner: red if unassigned */
    var ownerStyle = p.owner === 'Unassigned'
      ? 'color:var(--color-danger);font-weight:var(--fw-medium)'
      : 'color:var(--color-text-secondary)';

    return '<tr class="' + isSelected + ' fade-in" data-id="' + p.id + '" ' +
      'style="animation-delay:' + (idx * 30) + 'ms">' +
      '<td><div class="patient-avatar" style="background:' + riskColor + '">' + p.initials + '</div></td>' +
      '<td><div style="font-weight:var(--fw-medium)">' + p.name + '</div>' +
        '<div style="font-size:.68rem;color:var(--color-text-muted)">' +
          p.id + ' · ' + p.weeks + 'w · ' + p.insurer + '</div></td>' +
      '<td>' + gauge + '</td>' +
      '<td><span class="badge ' + riskBadge + '">' + p.riskLevel + '</span></td>' +
      '<td><span class="badge ' + priBadge + '">' + p.priority + '</span></td>' +
      '<td style="font-size:.78rem;color:var(--color-text-secondary)">~' + p.dropoutWindow + 'd</td>' +
      '<td><span style="' + daysStyle + '">' + p.daysSince + 'd</span></td>' +
      '<td style="font-size:.76rem;' + ownerStyle + '">' + p.owner + '</td>' +
      '<td><span class="badge ' + stsBadge + '">' + p.status + '</span></td>' +
      '<td><button class="btn-action" onclick="event.stopPropagation()">' + p.action + '</button></td>' +
    '</tr>';
  }).join('');

  /* Update filter count */
  var totalCount = (EnaraApp.state.allPatients || []).length;
  document.getElementById('filter-count').textContent =
    state.filteredPatients.length + ' of ' + totalCount + ' patients';

  /* Bind row click events (desktop + mobile touch) */
  tbody.querySelectorAll('tr').forEach(function(tr) {
    function handleRowTap() {
      state.selectedPatientId = tr.dataset.id;
      EnaraApp.renderTable();
      EnaraApp.openDrawer(state.selectedPatientId);
    }

    /* Desktop click */
    tr.addEventListener('click', handleRowTap);

    /* Mobile: use touchend to avoid scroll-vs-tap conflict */
    var touchStartY = 0;
    tr.addEventListener('touchstart', function(e) {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    tr.addEventListener('touchend', function(e) {
      var touchEndY = e.changedTouches[0].clientY;
      var delta = Math.abs(touchEndY - touchStartY);
      /* Only trigger if not scrolling (< 10px vertical movement) */
      if (delta < 10) {
        e.preventDefault();
        handleRowTap();
      }
    });
  });
};

/* ----- Sorting ----- */
EnaraApp.sortPatients = function() {
  var state = EnaraApp.state;
  var col = state.sortColumn;
  var dir = state.sortDirection;

  state.filteredPatients.sort(function(a, b) {
    var va = a[col], vb = b[col];
    if (col === 'riskLevel' || col === 'priority') {
      va = EnaraApp.RISK_ORDER[va] || 0;
      vb = EnaraApp.RISK_ORDER[vb] || 0;
    }
    if (typeof va === 'string') return va.localeCompare(vb) * dir;
    return (va - vb) * dir;
  });
};

/* ----- Column header sort binding ----- */
EnaraApp.initSortHeaders = function() {
  document.querySelectorAll('.data-table thead th[data-sort]').forEach(function(th) {
    th.addEventListener('click', function() {
      var col = th.dataset.sort;
      var state = EnaraApp.state;

      if (state.sortColumn === col) {
        state.sortDirection *= -1;
      } else {
        state.sortColumn = col;
        state.sortDirection = -1;
      }

      document.querySelectorAll('.data-table thead th').forEach(function(h) {
        h.classList.remove('is-sorted');
      });
      th.classList.add('is-sorted');

      EnaraApp.sortPatients();
      EnaraApp.renderTable();
    });
  });
};
