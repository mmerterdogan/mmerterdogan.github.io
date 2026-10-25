// Pressure vessel scene above its case study: 96 frames rendered in Blender from the ANSYS mesh and
// von Mises result, scrubbed by the scroll position inside .journey.
(() => {
  const journey = document.querySelector('.journey');
  if (!journey || location.search.includes('print')) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cv = journey.querySelector('.seq__vessel'), ctx = cv.getContext('2d');
  const chap = journey.querySelector('.chap');
  const N = 96, pad = n => String(n).padStart(4, '0');
  const frames = Array.from({ length: N }, (_, i) => { const im = new Image(); im.decoding = 'async'; im.dataset.src = `assets/seq/vessel/f_${pad(i + 1)}.webp`; return im; });

  // every 8th frame first, then fill in, so scrubbing works before everything has arrived
  const fetchAll = () => {
    const order = [];
    for (let s = 8; s >= 1; s >>= 1) frames.forEach((im, i) => { if (i % s === 0 && !order.includes(im)) order.push(im); });
    order.forEach(im => { im.onload = () => draw(true); im.src = im.dataset.src; });
  };
  new IntersectionObserver((es, o) => { if (es[0].isIntersecting) { fetchAll(); o.disconnect(); } }, { rootMargin: '100% 0px' }).observe(journey);

  const nearest = i => {
    for (let d = 0; d < N; d++) for (const j of [i - d, i + d]) { const im = frames[j]; if (im && im.complete && im.naturalWidth) return im; }
    return null;
  };
  const size = () => { const r = Math.min(devicePixelRatio || 1, 2); cv.width = innerWidth * r; cv.height = innerHeight * r; last = null; draw(true); };
  // wide screens: fill and push right of the text; tall screens: fit the width so the vessel stays whole
  const paint = im => {
    const W = cv.width, H = cv.height, iw = im.naturalWidth, ih = im.naturalHeight, wide = W >= H;
    const s = wide ? Math.max(W * 1.1 / iw, H / ih) : W * 1.15 / iw;
    const w = iw * s, h = ih * s, x = (W - w) / 2 + (wide ? .05 * W : 0), y = wide ? (H - h) / 2 : H * .12;
    ctx.fillStyle = '#121212'; ctx.fillRect(0, 0, W, H); ctx.drawImage(im, x, y, w, h);
  };

  const progress = () => { const r = journey.getBoundingClientRect(); return Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - innerHeight))); };
  let sp = progress(), last = null, live = false, raf = 0, t0 = 0;
  function draw(force) {
    const im = nearest(Math.round(Math.min(1, Math.max(0, (sp - .03) / .9)) * (N - 1)));
    if (im && (im !== last || force)) { paint(im); last = im; }
  }
  const tick = t => {
    raf = 0; if (!live) return;
    const dt = Math.min(.1, (t - (t0 || t)) / 1000); t0 = t;
    const target = progress();
    sp = reduce ? target : sp + (target - sp) * (1 - Math.exp(-dt * 14));
    draw();
    if (Math.abs(target - sp) > .0005) raf = requestAnimationFrame(tick); else t0 = 0;
  };
  const wake = () => { if (live && !raf) raf = requestAnimationFrame(tick); };
  addEventListener('scroll', wake, { passive: true });
  new IntersectionObserver(es => {
    live = es[0].isIntersecting; journey.classList.toggle('live', live);
    if (chap) { chap.classList.toggle('on', live); chap.inert = !live; }
    if (live) { sp = progress(); draw(true); wake(); }
  }).observe(journey);
  addEventListener('resize', size); size();
})();
