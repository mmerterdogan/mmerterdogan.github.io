// Cinematic 3D intro: scrolling moves a camera through a small gallery with one exhibit per project.
// The models are simplified and built here from primitives; the numbers come from the case studies.
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const journey = document.querySelector('.journey');
const canvas = document.querySelector('.journey__cv');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (journey && canvas && !location.search.includes('print')) {
  try { init(); } catch (e) { document.documentElement.classList.add('no-3d'); console.error(e); }
}

function init() {
  const css = getComputedStyle(document.documentElement);
  const v = (n, d) => new THREE.Color(css.getPropertyValue(n).trim() || d);
  const BG = v('--bg', '#121a33'), FG = v('--fg', '#f1efe9'), POP = v('--pop', '#f0b44c');
  const small = innerWidth < 760;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, small ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = !small; renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.background = BG.clone(); scene.fog = new THREE.Fog(BG, 9, 26);
  const camera = new THREE.PerspectiveCamera(small ? 50 : 38, 1, .05, 80);

  scene.add(new THREE.HemisphereLight(FG.clone().lerp(BG, .3), BG, .55));

  // ── gallery: floor, walls, plinths, spotlights ──
  const GAP = 9, N = 4;
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 70), new THREE.MeshStandardMaterial({ color: BG.clone().lerp(FG, .08), roughness: .55, metalness: .15 }));
  floor.rotation.x = -Math.PI / 2; floor.position.z = -12; floor.receiveShadow = true; scene.add(floor);
  const wallMat = new THREE.MeshStandardMaterial({ color: BG.clone().lerp(FG, .05), roughness: .9 });
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(70, 9), wallMat);
  wall.rotation.y = Math.PI / 2; wall.position.set(-4.6, 4.5, -12); wall.receiveShadow = true; scene.add(wall);
  // thin light lines in the floor lead the eye down the hall
  const lineMat = new THREE.MeshBasicMaterial({ color: POP, transparent: true, opacity: .35 });
  [-2.2, 2.2].forEach(x => { const l = new THREE.Mesh(new THREE.PlaneGeometry(.02, 60), lineMat); l.rotation.x = -Math.PI / 2; l.position.set(x, .002, -14); scene.add(l); });

  const plinthMat = new THREE.MeshStandardMaterial({ color: BG.clone().lerp(FG, .16), roughness: .5, metalness: .1 });
  const stations = [];
  for (let i = 0; i < N; i++) {
    const z = -i * GAP, g = new THREE.Group(); g.position.z = z; scene.add(g);
    const pl = new THREE.Mesh(new THREE.BoxGeometry(1.7, .9, 1.7), plinthMat); pl.position.y = .45; pl.castShadow = pl.receiveShadow = true; g.add(pl);
    const ring = new THREE.Mesh(new THREE.RingGeometry(1.25, 1.27, 64), lineMat); ring.rotation.x = -Math.PI / 2; ring.position.y = .003; g.add(ring);
    const spot = new THREE.SpotLight('#fff1dc', 0, 14, .42, .55, 1.2);
    spot.position.set(1.2, 6.5, z + 1.5); spot.target.position.set(0, 1.2, z);
    spot.castShadow = !small; spot.shadow.mapSize.set(1024, 1024); spot.shadow.bias = -.0004;
    scene.add(spot, spot.target);
    stations.push({ g, spot, z });
  }

  // framed images on the wall
  const loader = new THREE.TextureLoader();
  const frameMat = new THREE.MeshStandardMaterial({ color: '#141414', roughness: .5 });
  const hang = (src, z, y, h) => {
    const grp = new THREE.Group(); grp.position.set(-4.55, y, z); grp.rotation.y = Math.PI / 2; scene.add(grp);
    loader.load(src, tex => {
      tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
      const w = h * tex.image.width / tex.image.height;
      const fr = new THREE.Mesh(new THREE.BoxGeometry(w + .12, h + .12, .05), frameMat); fr.castShadow = true; grp.add(fr);
      const pic = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false }));
      pic.position.z = .03; grp.add(pic);
    });
    const l = new THREE.SpotLight('#fff1dc', 6, 6, .5, .7, 1.5); l.position.set(-2.6, y + 2.2, z); l.target = grp; scene.add(l);
  };
  const IMG = 'assets/img/';
  hang(IMG + 'pressure-vessel/von-mises.jpg', -.6, 2.2, 1.35);
  hang(IMG + 'pressure-vessel/safety-factor.jpg', -3.1, 2.0, 1.1);
  hang(IMG + 'uav/uav-render.jpg', -GAP - .6, 2.2, 1.35);
  hang(IMG + 'uav/landing-gear.jpg', -GAP - 3.1, 2.0, 1.1);
  hang(IMG + 'ml/confusion-matrix.png', -2 * GAP - .6, 2.2, 1.35);
  hang(IMG + 'ml/fault-by-steel.png', -2 * GAP - 3.1, 2.0, 1.1);

  // ── exhibit 1: pressure vessel with bolted head ──
  const metal = new THREE.Color('#c3c7cf');
  const vesselParts = [], ex1 = buildVessel(metal, FG, vesselParts);
  ex1.group.position.y = 1.62; ex1.group.scale.setScalar(.82); stations[0].g.add(ex1.group);

  // ── exhibit 2: quadcopter, landing gear in the accent colour ──
  const ex2 = buildDrone(POP); ex2.group.position.y = .9; stations[1].g.add(ex2.group);

  // ── exhibit 3: model accuracies as bars (test set, re-run of the original R script) ──
  const ex3 = buildBars(POP, FG); ex3.group.position.y = .9; stations[2].g.add(ex3.group);

  // ── exhibit 4: sprockets, chain and chain guard ──
  const ex4 = buildChain(POP, FG); ex4.group.position.y = 1.55; stations[3].g.add(ex4.group);

  scene.traverse(o => { if (o.isMesh && o !== floor && o !== wall) o.castShadow = true; });

  // ── camera path: keyframes against scroll progress ──
  const K = small ? 1.35 : 1;
  const keys = [
    [0.00, [.6, 2.3, 8.2], [-.6, 1.4, 0]],
    [0.10, [2.6 * K, 1.9, 4.3 * K], [-.2, 1.5, 0]],
    [0.27, [-1.6 * K, 2.3, 3.4 * K], [0, 1.5, 0]],
    [0.33, [2.6 * K, 1.9, 4.3 * K - GAP], [-.2, 1.4, -GAP]],
    [0.50, [-1.9 * K, 1.5, 3.2 * K - GAP], [0, 1.5, -GAP]],
    [0.56, [2.5 * K, 2.0, 4.3 * K - 2 * GAP], [-.2, 1.5, -2 * GAP]],
    [0.73, [-1.4 * K, 2.6, 3.6 * K - 2 * GAP], [0, 1.4, -2 * GAP]],
    [0.79, [2.6 * K, 1.9, 4.2 * K - 3 * GAP], [-.2, 1.5, -3 * GAP]],
    [0.95, [-1.8 * K, 2.1, 3.3 * K - 3 * GAP], [0, 1.6, -3 * GAP]],
    [1.00, [0, 6.5, -3 * GAP + 7], [0, .5, -3 * GAP - 2]],
  ];
  const sm = t => t * t * (3 - 2 * t);
  const camAt = (p, pos, tgt) => {
    let i = 0; while (i < keys.length - 2 && p > keys[i + 1][0]) i++;
    const [a, pa, ta] = keys[i], [b, pb, tb] = keys[i + 1];
    const t = sm(Math.min(1, Math.max(0, (p - a) / (b - a))));
    pos.set(...pa).lerp(new THREE.Vector3(...pb), t); tgt.set(...ta).lerp(new THREE.Vector3(...tb), t);
  };
  const band = (p, a, b) => sm(Math.min(1, Math.max(0, (p - a) / (b - a))));

  // ── size, input, scroll ──
  const size = () => { renderer.setSize(innerWidth, innerHeight, false); camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); };
  size(); addEventListener('resize', size);
  let mx = 0, my = 0, sx = 0, sy = 0;
  addEventListener('mousemove', e => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; });
  const progress = () => { const r = journey.getBoundingClientRect(); return Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - innerHeight))); };

  const chaps = [...document.querySelectorAll('.chap[data-at]')];
  const bar = document.querySelector('.journey__bar i');
  let active = true, sp = progress();
  new IntersectionObserver(es => { active = es[0].isIntersecting; canvas.style.visibility = active ? '' : 'hidden'; journey.classList.toggle('live', active); }).observe(journey);

  const pos = new THREE.Vector3(), tgt = new THREE.Vector3(), clock = new THREE.Clock();
  const frame = () => {
    requestAnimationFrame(frame);
    if (!active) return;
    const dt = Math.min(.1, clock.getDelta()), t = clock.elapsedTime;
    sp += (progress() - sp) * (reduce ? 1 : 1 - Math.exp(-dt * 5));
    const p = sp;

    camAt(p, pos, tgt);
    sx += (mx - sx) * .04; sy += (my - sy) * .04;
    camera.position.copy(pos).add(new THREE.Vector3(sx * .5, -sy * .3, 0));
    camera.lookAt(tgt);

    // lights come up one station at a time
    stations.forEach((s, i) => { const c = [.05, .33, .56, .79][i]; s.spot.intensity = 34 * (i ? band(p, c - .06, c + .02) : .55 + .45 * band(p, 0, .08)) * (1 - band(p, c + .3, c + .36) * .6); });

    // exhibit 1: rotate, open the bolted head, paint the stress contour
    const e1 = band(p, .1, .27);
    ex1.group.rotation.y = t * .15 + e1 * 1.6;
    ex1.update(band(e1, .1, .6), band(e1, .5, .95), band(e1, .25, .55) * (1 - band(e1, .85, 1)));
    // exhibit 2: props spin, the drone lifts off the plinth and lands again on its skids
    const e2 = band(p, .33, .5);
    ex2.update(t, Math.sin(e2 * Math.PI) * .45, e2);
    // exhibit 3: bars grow, the ensemble plane appears
    ex3.update(band(p, .56, .68), band(p, .66, .73), t);
    // exhibit 4: chain runs, guard closes
    ex4.update(t, band(p, .79, .9));

    chaps.forEach(c => { const [a, b] = c.dataset.at.split('-').map(Number); c.classList.toggle('on', p >= a && p < b); });
    if (bar) bar.style.setProperty('--p', p);
    renderer.render(scene, camera);
  };
  frame();
  document.documentElement.classList.add('has-3d');
}

// ── models ─────────────────────────────────────────────

function jet(v, c) {
  v = Math.min(1, Math.max(0, v));
  const s = ['#1f2fd6', '#1fa3e0', '#27c46a', '#e6d327', '#e8452c'], k = v * 4, i = Math.min(3, Math.floor(k));
  return c.set(s[i]).lerp(new THREE.Color(s[i + 1]), k - i);
}

function buildVessel(metal, fg, parts) {
  // shell r = 450 mm, half length 800 mm, elliptical heads, bolted head on one end (lathe axis = Y)
  const R = .45, HL = .8, seg = 72, V2 = THREE.Vector2;
  const ell = (h, y0, dir, n = 14) => { const p = []; for (let i = 0; i <= n; i++) { const a = i / n * Math.PI / 2; p.push(new V2(R * Math.sin(a) + 1e-4, y0 + dir * h * Math.cos(a))); } return dir < 0 ? p : p.reverse(); };
  const bodyP = [...ell(.225, -HL, -1)];
  for (let i = 1; i <= 24; i++) bodyP.push(new V2(R, -HL + i * 2 * HL / 24));
  bodyP.push(new V2(.56, HL), new V2(.56, HL + .05), new V2(R - .02, HL + .05));
  const headP = [new V2(R - .02, 0), new V2(.56, 0), new V2(.56, .05), new V2(R, .05), ...ell(.2, .05, 1)];
  const near = (y, y0, w) => Math.exp(-(((y - y0) / w) ** 2));
  const lathe = (prof, field) => {
    const g = new THREE.LatheGeometry(prof, seg), pos = g.attributes.position, n = pos.count;
    const contour = new Float32Array(n * 3), plain = new Float32Array(n * 3), c = new THREE.Color();
    for (let i = 0; i < n; i++) { jet(field(pos.getX(i), pos.getY(i), pos.getZ(i)), c); contour.set([c.r, c.g, c.b], i * 3); plain.set([metal.r, metal.g, metal.b], i * 3); }
    g.setAttribute('color', new THREE.BufferAttribute(plain.slice(), 3));
    const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ vertexColors: true, metalness: .45, roughness: .38, side: THREE.DoubleSide }));
    const wire = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: '#0d1430', wireframe: true, transparent: true, opacity: 0 }));
    m.add(wire); parts.push({ g, contour, plain, wire }); return m;
  };
  const group = new THREE.Group(), inner = new THREE.Group(); inner.rotation.z = Math.PI / 2; group.add(inner);
  inner.add(lathe(bodyP, (x, y) => y < -HL ? .26 : Math.max(.3, .3 + .7 * near(y, HL + .03, .09))));
  const head = new THREE.Group(); head.position.y = HL + .05; inner.add(head);
  head.add(lathe(headP, (x, y) => .28 + .72 * near(y, .02, .07)));
  const boltMat = new THREE.MeshStandardMaterial({ color: '#2b2f37', metalness: .85, roughness: .3 });
  const bg = new THREE.CylinderGeometry(.013, .013, .16, 10), ng = new THREE.CylinderGeometry(.024, .024, .02, 6), bolts = [];
  for (let k = 0; k < 24; k++) {
    const a = k / 24 * Math.PI * 2, b = new THREE.Group(); b.add(new THREE.Mesh(bg, boltMat));
    [.065, -.065].forEach(y => { const n = new THREE.Mesh(ng, boltMat); n.position.y = y; b.add(n); });
    b.userData = { home: new THREE.Vector3(.51 * Math.cos(a), HL + .05, .51 * Math.sin(a)), dir: new THREE.Vector3(Math.cos(a), 0, Math.sin(a)), spin: (Math.random() - .5) * 5, k };
    b.position.copy(b.userData.home); inner.add(b); bolts.push(b);
  }
  const nozMat = new THREE.MeshStandardMaterial({ color: metal, metalness: .45, roughness: .38 });
  [[-.35, .07], [.3, .05]].forEach(([y, r]) => {
    const n = new THREE.Mesh(new THREE.CylinderGeometry(r, r, .2, 28), nozMat); n.rotation.x = Math.PI / 2; n.position.set(0, y, R + .07); inner.add(n);
    const f = new THREE.Mesh(new THREE.CylinderGeometry(r + .035, r + .035, .025, 28), nozMat); f.rotation.x = Math.PI / 2; f.position.set(0, y, R + .17); inner.add(f);
  });
  const sad = new THREE.MeshStandardMaterial({ color: '#3a3f4b', roughness: .6 });
  [-.5, .5].forEach(y => { const s = new THREE.Mesh(new THREE.BoxGeometry(.18, .1, .62), sad); s.position.set(-R - .03, y, 0); inner.add(s); });
  let last = -1;
  const update = (open, paint, wire) => {
    head.position.y = HL + .05 + open * .7; head.rotation.y = open * .5;
    bolts.forEach(b => {
      const k = Math.min(1, Math.max(0, open * 1.3 - (b.userData.k % 6) * .05));
      b.position.copy(b.userData.home).addScaledVector(b.userData.dir, k * (.3 + (b.userData.k % 4) * .07));
      b.position.y += k * (.35 + (b.userData.k % 5) * .05); b.rotation.set(k * b.userData.spin, 0, k * b.userData.spin * .6);
    });
    if (Math.abs(paint - last) > .004) {
      last = paint;
      parts.forEach(({ g, contour, plain }) => { const c = g.attributes.color.array; for (let i = 0; i < c.length; i++) c[i] = plain[i] + (contour[i] - plain[i]) * paint; g.attributes.color.needsUpdate = true; });
    }
    parts.forEach(({ wire: w }) => { w.material.opacity = wire * .3; w.visible = wire > .01; });
  };
  return { group, update };
}

function buildDrone(pop) {
  const group = new THREE.Group(), body = new THREE.Group(); group.add(body);
  const carbon = new THREE.MeshStandardMaterial({ color: '#4a4636', roughness: .45, metalness: .3 });
  const dark = new THREE.MeshStandardMaterial({ color: '#1d1f24', roughness: .5, metalness: .4 });
  const grey = new THREE.MeshStandardMaterial({ color: '#c9cbd0', roughness: .4, metalness: .2 });
  const gearMat = new THREE.MeshStandardMaterial({ color: pop, roughness: .35, metalness: .25, emissive: pop, emissiveIntensity: .12 });
  const plate = (y) => { const m = new THREE.Mesh(new THREE.BoxGeometry(.5, .025, .38), carbon); m.position.y = y; body.add(m); };
  plate(.62); plate(.5);
  const bat = new THREE.Mesh(new THREE.BoxGeometry(.3, .09, .16), new THREE.MeshStandardMaterial({ color: '#e5cc3e', roughness: .5 })); bat.position.y = .56; body.add(bat);
  const tube = new THREE.Mesh(new THREE.CylinderGeometry(.055, .055, .36, 20), grey); tube.rotation.z = Math.PI / 2; tube.position.y = .69; body.add(tube);
  const props = [];
  [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(([a, b]) => {
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(.018, .018, .8, 12), carbon);
    arm.rotation.z = Math.PI / 2; arm.rotation.y = Math.atan2(b, a) * -1; arm.position.set(a * .26, .62, b * .26); body.add(arm);
    const mx = a * .55, mz = b * .55;
    const mot = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, .07, 20), dark); mot.position.set(mx, .67, mz); body.add(mot);
    const prop = new THREE.Group(); prop.position.set(mx, .72, mz);
    const blade = new THREE.Mesh(new THREE.BoxGeometry(.62, .006, .045), grey); prop.add(blade);
    const disc = new THREE.Mesh(new THREE.CircleGeometry(.31, 40), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: .06, side: THREE.DoubleSide }));
    disc.rotation.x = -Math.PI / 2; prop.add(disc); body.add(prop); props.push(prop);
  });
  // skid landing gear: two legs per side, skids along X with rubber pads and printed T-joints
  [-1, 1].forEach(s => {
    [-1, 1].forEach(f => {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(.016, .016, .56, 14), gearMat);
      leg.position.set(f * .14, .235, s * .2); leg.rotation.x = -s * .29; body.add(leg);
      const tj = new THREE.Mesh(new THREE.SphereGeometry(.035, 16, 12), grey); tj.position.set(f * .14, -.03, s * .28); body.add(tj);
    });
    const skid = new THREE.Mesh(new THREE.CylinderGeometry(.018, .018, .78, 14), gearMat); skid.rotation.z = Math.PI / 2; skid.position.set(0, -.03, s * .28); body.add(skid);
    [-1, 1].forEach(e => { const pad = new THREE.Mesh(new THREE.CylinderGeometry(.03, .03, .16, 14), dark); pad.rotation.z = Math.PI / 2; pad.position.set(e * .32, -.03, s * .28); body.add(pad); });
  });
  body.position.y = .05;
  const update = (t, lift, k) => {
    props.forEach((p, i) => p.rotation.y = t * (18 + lift * 30) * (i % 2 ? 1 : -1));
    body.position.y = .05 + lift + (lift > .02 ? Math.sin(t * 3) * .02 : 0);
    body.rotation.y = k * 1.4 + Math.sin(t * .4) * .1; body.rotation.z = Math.sin(t * 1.7) * .03 * lift;
  };
  return { group, update };
}

function label(text, color, w = 512, h = 96) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d');
  x.fillStyle = color; x.font = '600 44px Archivo, Arial, sans-serif'; x.textBaseline = 'middle'; x.fillText(text, 8, h / 2);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false })); s.scale.set(w / h * .12, .12, 1); return s;
}

function buildBars(pop, fg) {
  // test accuracy of the seven classifiers and the voting ensemble (91.3%)
  const data = [['Decision tree', .786], ['k-NN', .821], ['Naive Bayes', .829], ['Logistic reg.', .841], ['SVM', .877, 1], ['Random forest', .905, 1], ['XGBoost', .909, 1]];
  const group = new THREE.Group(), bars = [];
  const base = .7, scale = 4;   // bars start at 70%
  data.forEach(([name, a, top], i) => {
    const h = (a - base) * scale, x = (i - 3) * .2;
    const m = new THREE.Mesh(new THREE.BoxGeometry(.13, 1, .13), new THREE.MeshStandardMaterial({ color: top ? pop : fg.clone().multiplyScalar(.75), roughness: .4, metalness: .2, emissive: top ? pop : 0x000000, emissiveIntensity: top ? .15 : 0 }));
    m.position.set(x, 0, 0); group.add(m);
    const l = label(`${name}  ${(a * 100).toFixed(1)}%`, top ? '#' + pop.getHexString() : '#' + fg.getHexString());
    l.visible = false;
    bars.push({ m, h, l, x });
  });
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(1.7, .9), new THREE.MeshBasicMaterial({ color: pop, transparent: true, opacity: 0, side: THREE.DoubleSide }));
  plane.rotation.x = -Math.PI / 2; plane.position.y = (.913 - base) * scale; group.add(plane);
  const ens = label('Voting ensemble 91.3%', '#' + pop.getHexString()); ens.position.set(.55, (.913 - base) * scale + .12, .45); group.add(ens);
  const update = (grow, show, t) => {
    bars.forEach(({ m, h, l, x }, i) => {
      const k = Math.min(1, Math.max(0, grow * 1.6 - i * .09)), hh = Math.max(.001, h * k);
      m.scale.y = hh; m.position.y = hh / 2; l.position.set(x, hh + .04, .08); l.material.opacity = k;
    });
    plane.material.opacity = show * .22; ens.material.opacity = show;
    group.rotation.y = Math.sin(t * .25) * .25 - .3;
  };
  return { group, update };
}

function buildChain(pop, fg) {
  const group = new THREE.Group();
  const steel = new THREE.MeshStandardMaterial({ color: '#b9bec7', metalness: .8, roughness: .3 });
  const gear = (r, teeth) => {
    const s = new THREE.Shape(), n = teeth * 2;
    for (let i = 0; i <= n; i++) { const a = i / n * Math.PI * 2, rr = i % 2 ? r : r * .9; i ? s.lineTo(rr * Math.cos(a), rr * Math.sin(a)) : s.moveTo(rr, 0); }
    const hole = new THREE.Path(); hole.absarc(0, 0, r * .3, 0, Math.PI * 2, true); s.holes.push(hole);
    const g = new THREE.ExtrudeGeometry(s, { depth: .04, bevelEnabled: false, curveSegments: 6 }); g.translate(0, 0, -.02);
    return new THREE.Mesh(g, steel);
  };
  const big = gear(.42, 38), sm = gear(.17, 14); big.position.x = .35; sm.position.x = -.6; group.add(big, sm);
  // chain: links travel along the outline of both sprockets
  const path = new THREE.CurvePath(); const r1 = .42, r2 = .17, c1 = new THREE.Vector2(.35, 0), c2 = new THREE.Vector2(-.6, 0);
  const pts = [];
  for (let i = 0; i <= 40; i++) { const a = -Math.PI / 2 + i / 40 * Math.PI; pts.push(new THREE.Vector3(c1.x + r1 * Math.cos(a), r1 * Math.sin(a), 0)); }
  for (let i = 0; i <= 20; i++) { const a = Math.PI / 2 + i / 20 * Math.PI; pts.push(new THREE.Vector3(c2.x + r2 * Math.cos(a), r2 * Math.sin(a) * (r1 / r2) * .0 + r2 * Math.sin(a), 0)); }
  const loop = new THREE.CatmullRomCurve3(pts, true);
  const links = [], linkGeo = new THREE.BoxGeometry(.035, .022, .05), linkMat = new THREE.MeshStandardMaterial({ color: '#9aa1ab', metalness: .7, roughness: .35 });
  for (let i = 0; i < 70; i++) { const l = new THREE.Mesh(linkGeo, linkMat); group.add(l); links.push(l); }
  // chain guard: a sheet that follows the top of the chain loop, dropping into place
  const gs = new THREE.Shape(), outer = [], inner = [];
  for (let i = 0; i <= 60; i++) {
    const u = i / 60, q = loop.getPointAt(u), d = loop.getTangentAt(u), nrm = new THREE.Vector2(d.y, -d.x).normalize();
    if (q.y < -.01) continue;
    outer.push(new THREE.Vector2(q.x + nrm.x * .11, q.y + nrm.y * .11)); inner.push(new THREE.Vector2(q.x + nrm.x * .06, q.y + nrm.y * .06));
  }
  outer.sort((a, b) => a.x - b.x); inner.sort((a, b) => b.x - a.x);
  gs.moveTo(outer[0].x, outer[0].y); outer.forEach(v => gs.lineTo(v.x, v.y)); inner.forEach(v => gs.lineTo(v.x, v.y));
  const guardMat = new THREE.MeshStandardMaterial({ color: pop, roughness: .4, metalness: .3, side: THREE.DoubleSide, transparent: true, opacity: .95, emissive: pop, emissiveIntensity: .12 });
  const guard = new THREE.Mesh(new THREE.ExtrudeGeometry(gs, { depth: .14, bevelEnabled: false }), guardMat);
  guard.geometry.translate(0, 0, -.07); group.add(guard);
  const update = (t, k) => {
    big.rotation.z = -t * .8; sm.rotation.z = -t * .8 * (38 / 14);
    links.forEach((l, i) => { const u = ((i / links.length) + t * .05) % 1, p = loop.getPointAt(u), d = loop.getTangentAt(u); l.position.copy(p); l.rotation.z = Math.atan2(d.y, d.x); });
    guard.position.y = (1 - k) * .8; guard.material.opacity = .2 + k * .75;
    group.rotation.y = -.5 + Math.sin(t * .3) * .2; group.rotation.x = -.15;
  };
  return { group, update };
}
