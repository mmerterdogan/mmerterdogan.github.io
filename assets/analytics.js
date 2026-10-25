// Visit counting with GoatCounter (no cookies). count.js counts the page view itself; this file adds events:
//   view-<project>     a project chapter of the 3D tour came on screen (once per visit)
//   open-<project>     "Read the case" was clicked
//   details-<project>  "Method and details" was opened
//   download-<file>    a PDF was opened
//   ref-<source>       the visit came through a link with ?ref=<source>
// The numbers are read back by dashboard.html. Localhost visits are ignored by GoatCounter.
(() => {
  if (location.search.includes('print')) return;
  const queue = [];
  const send = path => {
    if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path, title: path, event: true });
    else queue.push(path);
  };
  const flush = setInterval(() => {
    if (window.goatcounter && window.goatcounter.count) { queue.splice(0).forEach(send); clearInterval(flush); }
  }, 1000);
  const once = path => {
    try { if (sessionStorage.getItem('gc:' + path)) return; sessionStorage.setItem('gc:' + path, '1'); } catch (e) {}
    send(path);
  };

  // source of the visit: links I share carry ?ref=<source>
  const ref = new URLSearchParams(location.search).get('ref');
  if (ref && /^[a-z0-9-]{1,30}$/i.test(ref)) once('ref-' + ref.toLowerCase());

  // project chapters of the 3D tour
  document.querySelectorAll('.chap[data-id]').forEach(c => new MutationObserver(() => {
    if (c.classList.contains('on')) once('view-' + c.dataset.id);
  }).observe(c, { attributes: true, attributeFilter: ['class'] }));

  const caseId = h => ({ '#pressure-vessel': 'pressure-vessel', '#uav': 'uav', '#ml': 'ml', '#more': 'formula-student' })[h];
  document.addEventListener('click', e => {
    const a = e.target.closest('a'); if (!a) return;
    const href = a.getAttribute('href') || '';
    if (href.endsWith('.pdf')) send('download-' + href.split('/').pop().replace('.pdf', '').replace('Muhammet_Mert_Erdogan_', '').toLowerCase());
    else if (href.endsWith('.vcf')) send('download-vcard');
    else if (a.classList.contains('chap__go') && caseId(href)) send('open-' + caseId(href));
  });
  document.querySelectorAll('details.more').forEach(d => d.addEventListener('toggle', () => {
    const id = d.querySelector('.sheet')?.id || '';
    const key = id.startsWith('pressure') ? 'pressure-vessel' : id.startsWith('uav') ? 'uav' : id.startsWith('ml') ? 'ml' : id;
    if (d.open && key) once('details-' + key);
  }));
})();
