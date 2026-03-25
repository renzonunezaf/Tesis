/**
 * ==========================================================
 * FILTERS MODULE
 * Handles search and dropdown filter logic for the patient
 * intervention queue. All filtering is client-side.
 * ==========================================================
 */
EnaraApp.applyFilters = function() {
  var search   = document.getElementById('filter-search').value.toLowerCase();
  var risk     = document.getElementById('filter-risk').value;
  var status   = document.getElementById('filter-status').value;
  var insurer  = document.getElementById('filter-insurer').value;
  var medTrack = document.getElementById('filter-medtrack').value;
  var modality = document.getElementById('filter-modality').value;
  var owner    = document.getElementById('filter-owner').value;

  EnaraApp.state.filteredPatients = EnaraApp.PATIENTS.filter(function(p) {
    if (search && !p.name.toLowerCase().includes(search) && !p.id.toLowerCase().includes(search)) return false;
    if (risk     && p.riskLevel !== risk)     return false;
    if (status   && p.status   !== status)   return false;
    if (insurer  && p.insurer  !== insurer)  return false;
    if (medTrack && p.medTrack !== medTrack) return false;
    if (modality && p.modality !== modality) return false;
    if (owner    && p.owner    !== owner)    return false;
    return true;
  });

  EnaraApp.sortPatients();
  EnaraApp.renderTable();
};

EnaraApp.clearFilters = function() {
  document.querySelectorAll('.filter-bar select').forEach(function(s) { s.value = ''; });
  document.getElementById('filter-search').value = '';
  EnaraApp.applyFilters();
};

EnaraApp.initFilters = function() {
  document.querySelectorAll('.filter-bar select, .filter-bar input').forEach(function(el) {
    el.addEventListener('input', EnaraApp.applyFilters);
  });
  document.getElementById('filter-clear').addEventListener('click', EnaraApp.clearFilters);
};
