// Selected work as a scroll-scrubbed sequence (replaces the three.js gallery):
//   pressure vessel  rendered frames (Blender, from the ANSYS model and its von Mises result)
//   UAV              frames of the flight test clip
//   steel defects    accuracy bars that grow with the scroll
//   Formula Student  powertrain render with the two chain guards
// Progress p runs 0..1 over the .journey section; each scene owns a window of p.
(() => {
  const journey = document.querySelector('.journey');
  if (!journey || location.search.includes('print')) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = s => journey.querySelector(s);

  // ── frames ──
  const pad = (n, w) => String(n).padStart(w, '0');
  const seqOf = (n, src) => Array.from({ length: n }, (_, i) => { const im = new Image(); im.decoding = 'async'; im.dataset.src = src(i); return im; });
  const vessel = seqOf(96, i => `assets/seq/vessel/f_${pad(i + 1, 4)}.webp`);
  const flight = seqOf(54, i => `assets/seq/uav/u_${pad(i + 1, 3)}.webp`);
  const fetchAll = arr => {            // every 8th frame first, then fill in, so scrubbing works early
    const order = []; for (let s = 8; s >= 1; s = s >> 1) arr.forEach((im, i) => { if (i % s === 0 && !order.includes(im)) order.push(im); });
    order.forEach(im => { im.src = im.dataset.src; });
  };
  vessel[0].src = vessel[0].dataset.src;
  vessel[0].onload = () => draw(true);
  new IntersectionObserver((es, o) => { if (es[0].isIntersecting) { fetchAll(vessel); fetchAll(flight); o.disconnect(); } },
    { rootMargin: '200% 0px' }).observe(journey);
  const nearest = (arr, i) => {
    for (let d = 0; d < arr.length; d++) {
      const a = arr[i - d], b = arr[i + d];
      if (a && a.complete && a.naturalWidth) return a;
      if (b && b.complete && b.naturalWidth) return b;
    }
    return null;
  };

  // ── canvases ──
  const cv = $('.seq__vessel'), ctx = cv.getContext('2d');
  const uc = $('.seq__uav canvas'), uctx = uc.getContext('2d');
  const size = () => {
    const r = Math.min(devicePixelRatio || 1, 2);
    cv.width = innerWidth * r; cv.height = innerHeight * r;
    lastV = null; draw(true);
  };
  const cover = (c, g, im, shift) => {
    const s = Math.max(c.width * (1 + 2 * Math.abs(shift)) / im.naturalWidth, c.height / im.naturalHeight);
    const w = im.naturalWidth * s, h = im.naturalHeight * s;
    g.drawImage(im, (c.width - w) / 2 + shift * c.width, (c.height - h) / 2, w, h);
  };

  // ── progress ──
  const progress = () => { const r = journey.getBoundingClientRect(); return Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - innerHeight))); };
  const clamp = x => Math.min(1, Math.max(0, x));
  const band = (p, a, b) => { const t = clamp((p - a) / (b - a)); return t * t * (3 - 2 * t); };
  const show = (el, o, dy = 30) => { el.style.opacity = o; el.style.transform = el.dataset.base + ` translateY(${(1 - o) * dy}px)`; el.style.visibility = o < .01 ? 'hidden' : 'visible'; };

  const uav = $('.seq__uav'), ml = $('.seq__ml'), fs = $('.seq__fs');
  [uav, ml, fs].forEach(el => { el.dataset.base = getComputedStyle(el).transform === 'none' ? '' : 'translateY(-50%)'; });
  const chaps = [...journey.querySelectorAll('.chap[data-at]')];
  const dots = [...journey.querySelectorAll('.journey__dots a')];
  const bar = $('.journey__bar i');
  let sp = progress(), lastV = null, lastU = null, live = true;

  function draw(force) {
    const p = sp, wide = innerWidth > 760;
    // vessel
    const vo = 1 - band(p, .39, .44);
    cv.style.opacity = vo;
    if (vo > 0) {
      const im = nearest(vessel, Math.round(clamp((p - .02) / .38) * (vessel.length - 1)));
      if (im && (im !== lastV || force)) { ctx.fillStyle = '#121212'; ctx.fillRect(0, 0, cv.width, cv.height); cover(cv, ctx, im, wide ? .14 : 0); lastV = im; }
    }
    // UAV flight
    const uo = band(p, .40, .45) * (1 - band(p, .62, .66));
    show(uav, uo);
    if (uo > 0) {
      const im = nearest(flight, Math.round(clamp((p - .43) / .19) * (flight.length - 1)));
      if (im && im !== lastU) { uctx.drawImage(im, 0, 0, uc.width, uc.height); lastU = im; }
    }
    // steel defects
    const mo = band(p, .63, .68) * (1 - band(p, .80, .85));
    show(ml, mo); ml.style.setProperty('--g', band(p, .66, .77));
    // Formula Student
    const fo = band(p, .81, .86);
    show(fs, fo);
    fs.style.setProperty('--z', band(p, .83, 1));
    fs.style.setProperty('--a', band(p, .87, .92));
    fs.style.setProperty('--b', band(p, .91, .96));
    // text, dots, bar
    chaps.forEach(c => { const [a, b] = c.dataset.at.split('-').map(Number), on = p >= a && p < b; c.classList.toggle('on', on); c.inert = !on; });
    dots.forEach(d => { const c = +d.dataset.p; d.classList.toggle('on', Math.abs(p - c) < .11); });
    if (bar) bar.style.setProperty('--p', p);
  }

  let last = performance.now();
  const loop = t => {
    requestAnimationFrame(loop);
    const dt = Math.min(.1, (t - last) / 1000); last = t;
    if (!live) return;
    const target = progress();
    if (Math.abs(target - sp) < .0004) { if (sp !== target) { sp = target; draw(); } return; }
    sp += (target - sp) * (reduce ? 1 : 1 - Math.exp(-dt * 12));
    draw();
  };
  requestAnimationFrame(loop);
  new IntersectionObserver(es => { live = es[0].isIntersecting; journey.classList.toggle('live', live); if (live) draw(true); }).observe(journey);
  addEventListener('resize', size); size();

  // dots jump to a project
  dots.forEach(d => d.addEventListener('click', e => {
    e.preventDefault();
    const top = journey.getBoundingClientRect().top + scrollY;
    scrollTo({ top: top + (+d.dataset.p) * (journey.offsetHeight - innerHeight), behavior: reduce ? 'auto' : 'smooth' });
  }));
})();
