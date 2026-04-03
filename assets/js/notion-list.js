(function () {
  var list = document.getElementById('notion-page-list');
  if (!list) return;

  var items = [].slice.call(list.querySelectorAll('.notion-file-item'));
  var pageSize = parseInt(list.getAttribute('data-page-size'), 10);
  if (!pageSize || pageSize < 1) pageSize = 20;

  var meta = document.getElementById('notion-list-meta');
  var totalEl = document.getElementById('notion-total-count');
  var nav = document.getElementById('notion-pagination');
  var label = document.getElementById('notion-page-label');
  var prev = document.getElementById('notion-prev');
  var next = document.getElementById('notion-next');

  var total = items.length;
  if (totalEl) totalEl.textContent = String(total);
  if (meta) meta.hidden = false;

  var totalPages = Math.max(1, Math.ceil(total / pageSize));
  var current = 1;

  function render() {
    var start = (current - 1) * pageSize;
    items.forEach(function (el, i) {
      el.hidden = i < start || i >= start + pageSize;
    });
    if (label) label.textContent = current + ' / ' + totalPages;
    if (prev) prev.disabled = current <= 1;
    if (next) next.disabled = current >= totalPages;
    if (nav) nav.hidden = totalPages <= 1;
  }

  if (prev) {
    prev.addEventListener('click', function () {
      if (current > 1) {
        current -= 1;
        render();
      }
    });
  }
  if (next) {
    next.addEventListener('click', function () {
      if (current < totalPages) {
        current += 1;
        render();
      }
    });
  }

  render();
})();
