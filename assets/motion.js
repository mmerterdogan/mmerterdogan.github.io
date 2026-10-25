// Motion for the editorial layout (see motion.css): split letters, image trail, marquee,
// horizontal work strip, parallax, reveals and a custom cursor. Off for print and reduced motion.
(() => {
  if (location.search.includes('print')) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;
  const wide = () => innerWidth > 820;

  // split headings into letters (kept inside word wrappers so lines break normally)
  document.querySelectorAll('.split').forEach(el => {
    let i = 0;
    const wrap = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.append(' '); return; }
            const w = document.createElement('span'); w.className = 'w';
            [...part].forEach(c => { const s = document.createElement('span'); s.className = 'ch'; s.style.setProperty('--i', i++); s.textContent = c; w.append(s); });
            frag.append(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) wrap(n);
      });
    };
    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    wrap(el);
  });

  // the name fills the width of the page, whatever the screen
  const name = document.querySelector('.hx__name');
  const fit = () => {
    if (!name) return;
    name.style.fontSize = '100px';
    const w = Math.max(...[...name.querySelectorAll('.ln')].map(l => l.scrollWidth));
    name.style.fontSize = Math.min(112, 100 * name.clientWidth / w * .7) + 'px';
  };
  fit(); document.fonts.ready.then(fit); addEventListener('resize', fit);

  // reveals
  document.querySelectorAll('.sheet, #about .about, .jobs, .skills, .edu, .contact-row').forEach(e => e.classList.add('rv'));
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .12, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.split, .rv, .fig').forEach(e => io.observe(e));
  requestAnimationFrame(() => document.querySelector('.hx__name')?.classList.add('in'));
  if (reduce) document.querySelectorAll('.split, .rv, .fig').forEach(e => e.classList.add('in'));

  // count numbers up when their sheet appears
  const count = el => {
    const m = el.textContent.match(/^([\d.]+)(.*)$/); if (!m || reduce) return;
    const end = parseFloat(m[1]), dec = (m[1].split('.')[1] || '').length, t0 = performance.now();
    const step = t => { const k = Math.min(1, (t - t0) / 1400), v = end * (1 - Math.pow(1 - k, 4));
      el.textContent = v.toFixed(dec) + m[2]; if (k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  };
  const io2 = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.querySelectorAll('.kpi b').forEach(count); io2.unobserve(e.target); }
  }), { threshold: .3 });
  document.querySelectorAll('.kpis').forEach(e => io2.observe(e));

  // image trail in the hero
  const hero = document.querySelector('.hx'), trail = document.querySelector('.hx__trail');
  const pics = ['pressure-vessel/von-mises.jpg', 'uav/uav-render.jpg', 'pressure-vessel/safety-factor.jpg', 'uav/landing-gear.jpg',
    'ml/confusion-matrix.png', 'pressure-vessel/mesh.jpg', 'uav/arm-clamp.jpg', 'pressure-vessel/head-deformation.jpg',
    'uav/drawing.jpg', 'ml/pca.png', 'pressure-vessel/global-vs-local.png', 'uav/assembly-bom.jpg'].map(p => 'assets/img/' + p);
  pics.forEach(src => { const im = new Image(); im.src = src; });
  let k = 0, lx = -999, ly = -999;
  const spawn = (x, y) => {
    const im = document.createElement('img');
    im.src = pics[k++ % pics.length]; im.alt = '';
    im.style.left = x + 'px'; im.style.top = y + 'px'; im.style.setProperty('--r', (Math.random() * 12 - 6).toFixed(1) + 'deg');
    trail.append(im); im.addEventListener('animationend', () => im.remove());
    while (trail.children.length > 9) trail.firstChild.remove();
  };
  if (hero && trail && !reduce) {
    if (fine) {
      hero.addEventListener('mousemove', e => {
        const r = trail.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
        if (Math.hypot(x - lx, y - ly) > 110) { spawn(x, y); lx = x; ly = y; }
      });
    }
    // drift on its own until the visitor moves the mouse (and always on touch screens)
    let idle = true, t = 0;
    hero.addEventListener('mousemove', () => { idle = false; clearTimeout(hero._t); hero._t = setTimeout(() => idle = true, 2500); });
    setInterval(() => {
      if (!idle || document.hidden || hero.getBoundingClientRect().bottom < 0) return;
      t += .55; const r = trail.getBoundingClientRect();
      spawn(r.width * (.5 + .36 * Math.sin(t * 1.3)), r.height * (.42 + .22 * Math.sin(t * 2.1 + 1)));
    }, 480);
  }

  // marquee: speed and direction follow the scroll
  const mq = document.querySelector('.mq__track');
  let vel = 0, lastY = scrollY, dir = 1;
  if (mq) {
    mq.innerHTML += mq.innerHTML;
    let x = 0;
    const loop = () => {
      const half = mq.scrollWidth / 2;
      x -= (reduce ? 0 : (.6 + Math.min(14, Math.abs(vel) * .35))) * dir;
      if (x <= -half) x += half; if (x > 0) x -= half;
      mq.style.transform = `translateX(${x}px)`;
      vel *= .9;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  // horizontal work strip and parallax, both driven by scroll
  const hs = document.querySelector('.hs'), track = document.querySelector('.hs__track'), bar = document.querySelector('.hs__bar');
  const sizeStrip = () => {
    if (!hs || !track) return;
    hs.style.height = wide() ? (track.scrollWidth - innerWidth + innerHeight + 40) + 'px' : '';
  };
  sizeStrip(); addEventListener('resize', sizeStrip); addEventListener('load', sizeStrip);
  const figImgs = [...document.querySelectorAll('.fig .frame img')];
  const onScroll = () => {
    const y = scrollY; vel = y - lastY; if (vel) dir = vel > 0 ? 1 : -1; lastY = y;
    if (hs && track && wide()) {
      const r = hs.getBoundingClientRect(), dist = track.scrollWidth - innerWidth;
      const p = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)));
      track.style.transform = `translateX(${-p * dist}px)`;
      bar && bar.style.setProperty('--p', p);
      track.querySelectorAll('.hs__img img').forEach((im, i) => im.style.setProperty('--px', (-8 + p * 10 - i * 2) + '%'));
    }
    if (!reduce) figImgs.forEach(im => {
      const r = im.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      im.style.setProperty('--py', (((r.top + r.height / 2) / innerHeight - .5) * -24).toFixed(1) + 'px');
    });
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // custom cursor
  if (fine && !reduce) {
    document.documentElement.classList.add('has-cur');
    const c = document.createElement('div'); c.className = 'cur'; c.innerHTML = '<span></span>'; document.body.append(c);
    let cx = innerWidth / 2, cy = innerHeight / 2, tx = cx, ty = cy;
    addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
    const lab = c.querySelector('span');
    document.addEventListener('mouseover', e => {
      const t = e.target.closest('a, summary, .fig img, button');
      c.classList.toggle('big', !!t);
      lab.textContent = !t ? '' : t.matches('.fig img') ? 'Zoom' : t.closest('.hs__card') ? 'Open' : t.matches('summary') ? 'More' : '';
    });
    const follow = () => { cx += (tx - cx) * .2; cy += (ty - cy) * .2; c.style.transform = `translate(${cx}px,${cy}px)`; requestAnimationFrame(follow); };
    follow();
  }
})();
