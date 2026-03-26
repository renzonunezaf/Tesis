/**
 * ==========================================================
 * LOG MODULE
 * Intervention Log view — chronological log of all patient
 * interventions with type indicators, outcomes, filtering.
 * ==========================================================
 */

/* ── Type → CSS class map ── */
EnaraApp._logTypeClass = function(type) {
  var map = {
    'Phone Call':         'phone',
    'Secure Message':     'message',
    'Provider Visit':     'visit',
    'Automated Check-in': 'auto',
    'Care Plan Review':   'care-plan',
    'Prior Auth Follow-up':'prior-auth'
  };
  return map[type] || 'phone';
};

/* ── Outcome → CSS class map ── */
EnaraApp._logOutcomeClass = function(outcome) {
  var map = {
    'Connected':      'connected',
    'Sent':           'sent',
    'Read':           'read',
    'Delivered':      'delivered',
    'No Answer':      'no-answer',
    'Left Voicemail': 'voicemail',
    'Unread':         'unread',
    'Updated':        'updated',
    'In Progress':    'in-progress',
    'Completed':      'completed'
  };
  return map[outcome] || 'sent';
};

/* ── Type → icon SVG ── */
EnaraApp._logTypeIcon = function(type) {
  var icons = {
    'Phone Call': '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M3 2h3l1.2 3-1.8 1.2c.8 1.6 1.8 2.6 3.5 3.5L10 8l3 1.2V12.5c0 .8-.7 1.3-1.5 1-6-2.5-8.5-7-7.5-10a1 1 0 0 1 0-1.5z"/></svg>',
    'Secure Message': '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2 3h12a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H9l-3 2v-2H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/></svg>',
    'Provider Visit': '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2 2v5a4 4 0 0 0 8 0V2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 11v2"/></svg>',
    'Automated Check-in': '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="8" cy="8" r="6"/><path d="M8 4v4l3 2"/></svg>',
    'Care Plan Review': '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M4 2h8a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z"/><path d="M6 6h4M6 9h3"/></svg>',
    'Prior Auth Follow-up': '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="2" y="3" width="12" height="10" rx="1.5"/><path d="M2 7h12M6 3v10"/></svg>'
  };
  return icons[type] || icons['Phone Call'];
};

/* ── Render the full log view ── */
/**
 * @param {Array} interventions - From api.getInterventionLog()
 * @param {Array} patients - From api.getPatients() (for name dropdown)
 */
EnaraApp.renderLog = function(interventions, patients) {
  var el = document.getElementById('view-log');

  /* Store for filter function */
  EnaraApp.state.interventions = interventions;

  /* Summary stats */
  var totalCalls = interventions.filter(function(i) { return i.type === 'Phone Call'; }).length;
  var totalMsgs = interventions.filter(function(i) { return i.type === 'Secure Message' || i.type === 'Automated Check-in'; }).length;
  var connected = interventions.filter(function(i) { return i.outcome === 'Connected' || i.outcome === 'Completed'; }).length;
  var noAnswer = interventions.filter(function(i) { return i.outcome === 'No Answer' || i.outcome === 'Left Voicemail'; }).length;
  var uniquePatients = [];
  interventions.forEach(function(i) {
    if (uniquePatients.indexOf(i.patientId) === -1) uniquePatients.push(i.patientId);
  });

  var html = '';

  /* Header */
  html += '<div class="log-header">' +
    '<div class="log-header__title">Intervention Log</div>' +
    '<div class="log-header__count">' + interventions.length + ' entries · Last 7 days</div>' +
  '</div>';

  /* Summary cards */
  html += '<div class="log-summary">' +
    '<div class="log-stat"><div class="log-stat__value log-stat__value--primary">' + interventions.length + '</div><div class="log-stat__label">Total Actions</div></div>' +
    '<div class="log-stat"><div class="log-stat__value log-stat__value--success">' + connected + '</div><div class="log-stat__label">Connected</div></div>' +
    '<div class="log-stat"><div class="log-stat__value log-stat__value--warning">' + noAnswer + '</div><div class="log-stat__label">No Answer</div></div>' +
    '<div class="log-stat"><div class="log-stat__value log-stat__value--muted">' + uniquePatients.length + '</div><div class="log-stat__label">Patients Reached</div></div>' +
    '<div class="log-stat"><div class="log-stat__value log-stat__value--danger">' + totalCalls + '</div><div class="log-stat__label">Phone Calls</div></div>' +
  '</div>';

  /* Filters */
  html += '<div class="log-filters">' +
    '<select id="log-filter-type"><option value="">All Types</option>' +
      '<option>Phone Call</option><option>Secure Message</option><option>Provider Visit</option>' +
      '<option>Automated Check-in</option><option>Care Plan Review</option><option>Prior Auth Follow-up</option>' +
    '</select>' +
    '<select id="log-filter-outcome"><option value="">All Outcomes</option>' +
      '<option>Connected</option><option>Sent</option><option>Read</option><option>Delivered</option>' +
      '<option>No Answer</option><option>Left Voicemail</option><option>Unread</option>' +
      '<option>Updated</option><option>In Progress</option><option>Completed</option>' +
    '</select>' +
    '<select id="log-filter-patient"><option value="">All Patients</option>' +
      patients.map(function(p) {
        return '<option value="' + p.id + '">' + p.name + '</option>';
      }).join('') +
    '</select>' +
  '</div>';

  /* Log list container */
  html += '<div class="log-list" id="log-list"></div>';

  el.innerHTML = html;

  /* Render entries */
  EnaraApp._renderLogEntries(interventions);

  /* Filter listeners */
  ['log-filter-type', 'log-filter-outcome', 'log-filter-patient'].forEach(function(id) {
    document.getElementById(id).addEventListener('change', EnaraApp._filterLog);
  });
};

/* ── Render log entries ── */
EnaraApp._renderLogEntries = function(entries) {
  var list = document.getElementById('log-list');

  list.innerHTML = entries.map(function(e, i) {
    var typeClass = EnaraApp._logTypeClass(e.type);
    var outcomeClass = EnaraApp._logOutcomeClass(e.outcome);
    var riskColor = EnaraApp.getRiskColor(e.riskAtTime);

    return '<div class="log-entry log-entry--' + typeClass + '" style="animation-delay:' + (i * 40) + 'ms">' +
      '<div class="log-entry__icon log-entry__icon--' + typeClass + '">' +
        EnaraApp._logTypeIcon(e.type) +
      '</div>' +
      '<div class="log-entry__content">' +
        '<div class="log-entry__top">' +
          '<span class="log-entry__patient">' + e.patientName + '</span>' +
          '<span class="log-entry__type">· ' + e.type + '</span>' +
          '<span class="log-outcome log-outcome--' + outcomeClass + '">' + e.outcome + '</span>' +
        '</div>' +
        '<div class="log-entry__note">' + e.note + '</div>' +
        '<div class="log-entry__by">by ' + e.initiatedBy + '</div>' +
      '</div>' +
      '<div class="log-entry__meta">' +
        '<div class="log-entry__datetime">' + e.date + '</div>' +
        '<div class="log-entry__time">' + e.time + '</div>' +
        '<div class="log-risk-badge" style="color:' + riskColor + ';border-color:' + riskColor + '">' +
          e.riskAtTime + '% risk' +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('');
};

/* ── Filter log entries ── */
EnaraApp._filterLog = function() {
  var typeFilter = document.getElementById('log-filter-type').value;
  var outcomeFilter = document.getElementById('log-filter-outcome').value;
  var patientFilter = document.getElementById('log-filter-patient').value;

  var filtered = (EnaraApp.state.interventions || []).filter(function(e) {
    if (typeFilter && e.type !== typeFilter) return false;
    if (outcomeFilter && e.outcome !== outcomeFilter) return false;
    if (patientFilter && e.patientId !== patientFilter) return false;
    return true;
  });

  EnaraApp._renderLogEntries(filtered);
};
