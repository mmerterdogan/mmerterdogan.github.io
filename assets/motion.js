// Small screen behaviours (see motion.css): hero name sizing, fade-in on scroll, timeline line,
// mobile menu, flight clip, copy email. Off for print, reduced motion respected.
(() => {
  if (location.search.includes('print')) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // hero name: letters rise once on load (kept inside word wrappers so lines break normally)
  const name = document.querySelector('.hx__name');
  if (name) {
    const label = name.textContent.replace(/\s+/g, ' ').trim();
    let i = 0;
    name.querySelectorAll('.ln').forEach(ln => {
      const text = ln.textContent; ln.textContent = '';
      text.split(/(\s+)/).forEach(part => {
        if (!part) return;
        if (/^\s+$/.test(part)) { ln.append(' '); return; }
        const w = document.createElement('span'); w.className = 'w'; w.setAttribute('aria-hidden', 'true');
        [...part].forEach(c => { const s = document.createElement('span'); s.className = 'ch'; s.style.setProperty('--i', i++); s.textContent = c; w.append(s); });
        ln.append(w);
      });
    });
    const sr = document.createElement('span'); sr.className = 'sr-only'; sr.textContent = label; name.prepend(sr);
    name.removeAttribute('aria-label');
    const fit = () => {
      name.style.fontSize = '100px';
      const w = Math.max(...[...name.querySelectorAll('.ln')].map(l => l.scrollWidth));
      name.style.fontSize = Math.min(104, 100 * name.clientWidth / w * .96) + 'px';
    };
    fit(); document.fonts.ready.then(fit); addEventListener('resize', fit);
    requestAnimationFrame(() => name.classList.add('in'));
  }

  // fade-in on scroll
  const rv = document.querySelectorAll('.card, .sheet, #about .about, .tl__item, .skills, .edu, .contact-row');
  if (!reduce) {
    rv.forEach(e => e.classList.add('rv'));
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { threshold: .1, rootMargin: '0px 0px -6% 0px' });
    rv.forEach(e => io.observe(e));
  }

  // timeline: the gold line follows the scroll
  const tl = document.querySelector('.tl');
  if (tl) {
    const draw = () => {
      const r = tl.getBoundingClientRect();
      tl.style.setProperty('--draw', Math.min(1, Math.max(0, (innerHeight * .65 - r.top) / r.height)).toFixed(3));
    };
    addEventListener('scroll', draw, { passive: true }); draw();
  }

  // mobile menu
  const menu = document.querySelector('.nav__menu'), links = document.getElementById('navlinks');
  if (menu && links) {
    const set = open => { menu.setAttribute('aria-expanded', open); document.documentElement.classList.toggle('menu-open', open); };
    menu.addEventListener('click', () => set(menu.getAttribute('aria-expanded') !== 'true'));
    links.addEventListener('click', e => { if (e.target.closest('a')) set(false); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
  }

  // flight clip plays while visible (stays on its poster with reduced motion)
  document.querySelectorAll('.fig--video video').forEach(v => {
    if (reduce) { v.controls = true; return; }
    new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); }), { threshold: .3 }).observe(v);
  });

  // copy email
  document.querySelectorAll('.copy[data-copy]').forEach(b => b.addEventListener('click', async () => {
    const label = b.textContent;
    try { await navigator.clipboard.writeText(b.dataset.copy); b.textContent = b.dataset.done || 'Copied'; }
    catch (e) { location.href = 'mailto:' + b.dataset.copy; return; }
    b.classList.add('done'); setTimeout(() => { b.textContent = label; b.classList.remove('done'); }, 1800);
  }));
})();
