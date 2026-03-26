/**
 * ==========================================================
 * UI UTILITIES
 * Loading skeletons, error states, and shared UI helpers.
 * Used by all modules when data is fetched asynchronously.
 * ==========================================================
 */

window.EnaraApp = window.EnaraApp || {};

/**
 * Show a loading skeleton inside a container.
 * @param {string} elementId - DOM id to inject skeleton into
 * @param {string} [type='default'] - Skeleton variant: 'default' | 'kpi' | 'table' | 'chart'
 */
EnaraApp.showLoading = function(elementId, type) {
  var el = document.getElementById(elementId);
  if (!el) return;

  var html = '';
  switch (type) {
    case 'kpi':
      /* 8 skeleton cards matching the KPI grid */
      html = Array(8).fill(
        '<div class="skeleton skeleton--kpi"><div class="skeleton__ring"></div>' +
        '<div class="skeleton__lines"><div class="skeleton__line skeleton__line--short"></div>' +
        '<div class="skeleton__line"></div></div></div>'
      ).join('');
      break;

    case 'table':
      /* 5 skeleton rows */
      html = Array(5).fill(
        '<div class="skeleton skeleton--row">' +
          '<div class="skeleton__circle"></div>' +
          '<div class="skeleton__lines" style="flex:1">' +
            '<div class="skeleton__line"></div>' +
            '<div class="skeleton__line skeleton__line--short"></div>' +
          '</div>' +
        '</div>'
      ).join('');
      break;

    case 'chart':
      html = '<div class="skeleton skeleton--chart">' +
        '<div class="skeleton__block"></div></div>';
      break;

    default:
      html = '<div class="skeleton"><div class="skeleton__line"></div>' +
        '<div class="skeleton__line skeleton__line--short"></div>' +
        '<div class="skeleton__line"></div></div>';
  }

  el.innerHTML = html;
};

/**
 * Show an error state with retry button.
 * @param {string} elementId - DOM id to inject error into
 * @param {string} message - Error description
 * @param {Function} [retryFn] - Function to call on retry click
 */
EnaraApp.showError = function(elementId, message, retryFn) {
  var el = document.getElementById(elementId);
  if (!el) return;

  var retryId = 'retry-' + elementId;
  el.innerHTML =
    '<div class="ui-error">' +
      '<div class="ui-error__icon">!</div>' +
      '<div class="ui-error__msg">' + (message || 'Failed to load data') + '</div>' +
      (retryFn ? '<button class="ui-error__btn" id="' + retryId + '">Retry</button>' : '') +
    '</div>';

  if (retryFn) {
    document.getElementById(retryId).addEventListener('click', retryFn);
  }
};
