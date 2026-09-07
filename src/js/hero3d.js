/* Chef Daija — the hero scene: "The Scale".
   Her real dishes orbit a golden Libra balance. ONE scrollProgress float drives
   every animation (house method, see the animated-3d-website-method skill).
   Three.js owns this canvas and nothing else on the page. */
import * as THREE from 'three';

const canvas = document.getElementById('hero-canvas');
if (canvas) init(canvas);

function init(canvas) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Real photos come in via the data attribute. No images -> gold panels, never
  // stock or generated food (DESIGN.md §6).
  let srcs = (canvas.dataset.images || '')
    .split(',').map(s => s.trim()).filter(Boolean);

  // Ship a separate, smaller texture set to phones: 521KB instead of 1.6MB.
  // Falls back to the desktop file per-image if a mobile variant is missing.
  const wantsMobileTextures = window.innerWidth < 700 || (window.innerWidth < 1000 && window.devicePixelRatio > 2);
  if (wantsMobileTextures) {
    srcs = srcs.map(u => u.replace('assets/img/', 'assets/img/mobile/'));
  }

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch (e) {
    canvas.style.display = 'none';           // no WebGL: the CSS light stays
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0a0b, 0.058);

  const camera = new THREE.PerspectiveCamera(46, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.set(0, 0, 9.2);

  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const key = new THREE.PointLight(0xf2d08a, 60, 40); key.position.set(3, 4, 6); scene.add(key);
  const rim = new THREE.PointLight(0xa8202e, 22, 40); rim.position.set(-5, -2, -3); scene.add(rim);

  const world = new THREE.Group(); world.position.z = -2.2; scene.add(world);

  /* --- the orbiting dishes ------------------------------------------- */
  const COUNT = Math.max(8, Math.min(srcs.length || 8, 12));
  const RADIUS = 6.4;
  const ring = new THREE.Group(); ring.rotation.x = -0.13; world.add(ring);
  const panels = [];

  // a gently curved plane reads richer than a flat one
  function curvedPlane(w, h) {
    const g = new THREE.PlaneGeometry(w, h, 24, 1);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      pos.setZ(i, -Math.pow(x / (w / 2), 2) * 0.28);   // bend away at the edges
    }
    g.computeVertexNormals();
    return g;
  }

  const loader = new THREE.TextureLoader();
  loader.setCrossOrigin('anonymous');

  for (let i = 0; i < COUNT; i++) {
    const a = (i / COUNT) * Math.PI * 2;
    const mat = new THREE.MeshStandardMaterial({
      color: 0x1b191e, roughness: 0.85, metalness: 0.1,
      transparent: true, opacity: 0.88, side: THREE.DoubleSide
    });

    const src = srcs[i % (srcs.length || 1)];
    if (src) {
      const apply = tex => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
        mat.map = tex; mat.color.set(0xffffff);
        mat.roughness = 0.65; mat.needsUpdate = true;
      };
      loader.load(src, apply, undefined, () => {
        // mobile variant missing -> try the full-size file, then give up quietly.
        // Never substitute a stock or generated photo (DESIGN.md 6).
        const full = src.replace('assets/img/mobile/', 'assets/img/');
        if (full !== src) loader.load(full, apply, undefined, () => {});
      });
    } else {
      mat.color.set(0x2a2229); mat.metalness = 0.55; mat.roughness = 0.4;
    }

    const m = new THREE.Mesh(curvedPlane(2.1, 1.55), mat);
    m.position.set(Math.cos(a) * RADIUS, Math.sin(i * 1.7) * 0.55, Math.sin(a) * RADIUS);
    m.rotation.y = -a + Math.PI / 2;
    m.userData.baseY = m.position.y;
    m.userData.phase = i * 0.9;
    ring.add(m); panels.push(m);
  }

  /* --- the Libra scale at the centre ---------------------------------- */
  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xd9a94a, roughness: 0.3, metalness: 0.9,
    emissive: new THREE.Color(0xd9a94a), emissiveIntensity: 0.5
  });
  const scaleGrp = new THREE.Group(); world.add(scaleGrp);

  // A big tilted gold hoop reads as the pan of a balance from across the room.
  // The earlier miniature scale (beam, pans, wires, post) was under 2% of the
  // frame and disappeared entirely behind the headline - drawn big or not at all.
  const hoop = new THREE.Mesh(new THREE.TorusGeometry(5.6, 0.014, 10, 220), goldMat);
  hoop.rotation.x = Math.PI / 2 - 0.13; scaleGrp.add(hoop);

  const hoop2 = new THREE.Mesh(new THREE.TorusGeometry(4.2, 0.008, 8, 180), goldMat);
  hoop2.rotation.x = Math.PI / 2 - 0.13; hoop2.position.y = -0.9; scaleGrp.add(hoop2);

  // the balance beam: one long bar with a pan hanging at each end
  const beam = new THREE.Group(); beam.position.y = 2.55; scaleGrp.add(beam);
  const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 7.2, 8), goldMat);
  bar.rotation.z = Math.PI / 2; beam.add(bar);
  [-3.4, 3.4].forEach(x => {
    const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.7, 6), goldMat);
    wire.position.set(x, -0.35, 0); beam.add(wire);
    const pan = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.01, 8, 60), goldMat);
    pan.rotation.x = Math.PI / 2; pan.position.set(x, -0.7, 0); beam.add(pan);
  });
  const pivot = new THREE.Mesh(new THREE.SphereGeometry(0.055, 14, 14), goldMat);
  beam.add(pivot);

  /* --- gold dust ------------------------------------------------------- */
  const N = 700, pts = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const r = 4 + Math.random() * 7, t = Math.random() * Math.PI * 2, p = Math.acos(2 * Math.random() - 1);
    pts[i * 3]     = r * Math.sin(p) * Math.cos(t);
    pts[i * 3 + 1] = r * Math.cos(p) * 0.6;
    pts[i * 3 + 2] = r * Math.sin(p) * Math.sin(t);
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(pts, 3));
  // a bare PointsMaterial renders square pixels, which reads as noise up close
  const dot = document.createElement('canvas'); dot.width = dot.height = 64;
  const dctx = dot.getContext('2d');
  const grad = dctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.35, 'rgba(255,255,255,0.6)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  dctx.fillStyle = grad; dctx.fillRect(0, 0, 64, 64);
  const dustTex = new THREE.CanvasTexture(dot);

  const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({
    color: 0xf2d08a, size: 0.055, map: dustTex, alphaTest: 0.02,
    transparent: true, opacity: 0.55,
    blending: THREE.AdditiveBlending, depthWrite: false
  }));
  world.add(dust);

  /* --- the single driver ----------------------------------------------- */
  let scrollProgress = 0;         // 0 at top of hero, 1 when it has left
  let mx = 0, my = 0, cx = 0, cy = 0;

  function readScroll() {
    const hero = canvas.closest('.hero') || canvas.parentElement;
    const r = hero.getBoundingClientRect();
    const p = -r.top / Math.max(r.height, 1);
    scrollProgress = Math.max(0, Math.min(1.3, p));
  }
  window.addEventListener('scroll', readScroll, { passive: true });
  readScroll();

  if (!reduced && window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('pointermove', e => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });
  }

  /* --- drag the ring, let it coast, then hand it back to the auto-spin ---
     touch-action:pan-y in the CSS keeps vertical page scrolling working on a
     phone while horizontal drags reach this handler. */
  let spin = 0, vel = 0, dragging = false, lastX = 0;
  if (!reduced) {
    canvas.style.pointerEvents = 'auto';
    canvas.style.touchAction = 'pan-y';
    canvas.style.cursor = 'grab';

    canvas.addEventListener('pointerdown', e => {
      dragging = true; lastX = e.clientX; vel = 0;
      canvas.style.cursor = 'grabbing';
      canvas.setPointerCapture(e.pointerId);
    });
    canvas.addEventListener('pointermove', e => {
      if (!dragging) return;
      const dx = (e.clientX - lastX) / window.innerWidth;
      lastX = e.clientX;
      spin += dx * 3.2;
      vel = dx * 3.2;                       // carry the throw into the coast
    });
    const release = e => {
      if (!dragging) return;
      dragging = false;
      canvas.style.cursor = 'grab';
      try { canvas.releasePointerCapture(e.pointerId); } catch (err) { /* already gone */ }
    };
    canvas.addEventListener('pointerup', release);
    canvas.addEventListener('pointercancel', release);
    canvas.addEventListener('pointerleave', release);
  }

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // pull back on narrow screens so the ring still fits
    camera.position.z = (w < 700 ? 12.6 : 9.2) + scrollProgress * 3.2;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  /* --- loop ------------------------------------------------------------ */
  let visible = true, raf = 0;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(es => { visible = es[0].isIntersecting; })
      .observe(canvas);
  }
  document.addEventListener('visibilitychange', () => { visible = !document.hidden; });

  const clock = new THREE.Clock();
  const pv = new THREE.Vector3();

  function frame() {
    const t = clock.getElapsedTime();
    const sp = scrollProgress;

    if (!dragging) {
      spin += 0.0009 + vel;                 // idle drift plus whatever is left of the throw
      vel *= 0.94;                          // coast
    }
    ring.rotation.y = spin + sp * 0.9;
    panels.forEach(m => {
      m.position.y = m.userData.baseY + Math.sin(t * 0.5 + m.userData.phase) * 0.13;
    });

    hoop.rotation.z = t * 0.02;
    hoop2.rotation.z = -t * 0.03;
    beam.rotation.z = Math.sin(t * 0.28) * 0.045 - sp * 0.2;   // the scale tips
    dust.rotation.y = -t * 0.018;

    // camera: dolly out and lift on scroll, plus damped mouse parallax
    cx += (mx * 0.55 - cx) * 0.045;
    cy += (my * 0.35 - cy) * 0.045;
    const base = canvas.clientWidth < 700 ? 12.6 : 9.2;
    camera.position.x = cx;
    camera.position.y = -cy + sp * 1.35;
    camera.position.z = base + sp * 3.2;
    camera.lookAt(0, sp * 0.5, 0);

    // fade per group so the dust keeps its own base opacity
    const fade = Math.max(0, 1 - sp * 0.9);
    panels.forEach(m => {
      m.getWorldPosition(pv);
      const d = pv.distanceTo(camera.position);
      // 0 at the near edge of the ring, 1 once it has travelled to the back
      const depth = THREE.MathUtils.smoothstep(d, 6.0, 12.0);
      m.material.opacity = 0.92 * depth * fade;
      m.visible = m.material.opacity > 0.01;
    });
    dust.material.opacity = 0.55 * fade;
    scaleGrp.visible = fade > 0.02;

    renderer.render(scene, camera);
    raf = visible ? requestAnimationFrame(frame) : 0;
  }

  if (reduced) {
    renderer.render(scene, camera);           // one static frame, no loop
  } else {
    frame();
    // restart the loop when the hero scrolls back in
    const kick = () => { if (visible && !raf) frame(); };
    window.addEventListener('scroll', kick, { passive: true });
    document.addEventListener('visibilitychange', kick);
  }
}
