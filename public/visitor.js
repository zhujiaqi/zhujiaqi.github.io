(function () {
  var nodes = document.querySelectorAll('[data-visitor-count]');
  if (!nodes.length) return;
  var vid = '';
  try {
    vid = localStorage.getItem('visitor_id') || '';
    if (!vid) {
      vid = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : (Date.now().toString(36) + Math.random().toString(36).slice(2));
      localStorage.setItem('visitor_id', vid);
    }
  } catch (e) {}
  var endpoint = 'https://visitor-counter.zjq426.workers.dev/hit';
  var url = endpoint + '?page=' + encodeURIComponent(window.location.pathname) + '&vid=' + encodeURIComponent(vid);
  fetch(url, { cache: 'no-store' })
    .then(function (r) { return r.json(); })
    .then(function (data) {
      if (!data || typeof data.visitors !== 'number') return;
      var text = data.visitors.toLocaleString('en-US');
      for (var i = 0; i < nodes.length; i++) {
        var el = nodes[i];
        if (el.getAttribute('data-format') === 'pad6') {
          el.textContent = String(data.visitors).padStart(6, '0');
        } else {
          el.textContent = text;
        }
      }
    })
    .catch(function () {});
})();
