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
  const srcs = (canvas.dataset.images || '')
    .split(',').map(s => s.trim()).filter(Boolean);

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
  camera.position.set(0, 0, 7.6);

  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const key = new THREE.PointLight(0xf2d08a, 60, 40); key.position.set(3, 4, 6); scene.add(key);
  const rim = new THREE.PointLight(0xa8202e, 22, 40); rim.position.set(-5, -2, -3); scene.add(rim);

  const world = new THREE.Group(); scene.add(world);

  /* --- the orbiting dishes ------------------------------------------- */
  const COUNT = Math.max(8, Math.min(srcs.length || 8, 12));
  const RADIUS = 4.15;
  const ring = new THREE.Group(); world.add(ring);
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
      transparent: true, opacity: 0.96, side: THREE.DoubleSide
    });

    const src = srcs[i % (srcs.length || 1)];
    if (src) {
      loader.load(src, tex => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
        mat.map = tex; mat.color.set(0xffffff);
        mat.roughness = 0.65; mat.needsUpdate = true;
      }, undefined, () => { /* keep the panel; never substitute a fake photo */ });
    } else {
      mat.color.set(0x2a2229); mat.metalness = 0.55; mat.roughness = 0.4;
    }

    const m = new THREE.Mesh(curvedPlane(2.05, 1.5), mat);
    m.position.set(Math.cos(a) * RADIUS, Math.sin(i * 1.7) * 0.55, Math.sin(a) * RADIUS);
    m.rotation.y = -a + Math.PI / 2;
    m.userData.baseY = m.position.y;
    m.userData.phase = i * 0.9;
    ring.add(m); panels.push(m);
  }

  /* --- the Libra scale at the centre ---------------------------------- */
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xd9a94a, roughness: 0.28, metalness: 1 });
  const scaleGrp = new THREE.Group(); world.add(scaleGrp);

  const hoop = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.018, 12, 140), goldMat);
  hoop.rotation.x = Math.PI / 2; scaleGrp.add(hoop);

  const beam = new THREE.Group(); scaleGrp.add(beam);
  beam.add(new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 2.7, 10), goldMat)
    .rotateZ(Math.PI / 2));
  [-1.35, 1.35].forEach(x => {
    const pan = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.012, 10, 60), goldMat);
    pan.rotation.x = Math.PI / 2; pan.position.set(x, -0.42, 0); beam.add(pan);
    const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.42, 6), goldMat);
    wire.position.set(x, -0.21, 0); beam.add(wire);
  });
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.1, 10), goldMat);
  post.position.y = -0.55; scaleGrp.add(post);

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
  const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({
    color: 0xf2d08a, size: 0.035, transparent: true, opacity: 0.55,
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

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // pull back on narrow screens so the ring still fits
    camera.position.z = (w < 700 ? 10.4 : 7.6) + scrollProgress * 3.2;
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

  function frame() {
    const t = clock.getElapsedTime();
    const sp = scrollProgress;

    ring.rotation.y = t * 0.055 + sp * 0.9;
    panels.forEach(m => {
      m.position.y = m.userData.baseY + Math.sin(t * 0.5 + m.userData.phase) * 0.13;
    });

    hoop.rotation.z = t * 0.07;
    beam.rotation.z = Math.sin(t * 0.35) * 0.055 - sp * 0.16;   // the scale tips
    dust.rotation.y = -t * 0.018;

    // camera: dolly out and lift on scroll, plus damped mouse parallax
    cx += (mx * 0.55 - cx) * 0.045;
    cy += (my * 0.35 - cy) * 0.045;
    const base = canvas.clientWidth < 700 ? 10.4 : 7.6;
    camera.position.x = cx;
    camera.position.y = -cy + sp * 1.35;
    camera.position.z = base + sp * 3.2;
    camera.lookAt(0, sp * 0.5, 0);

    // fade per group so the dust keeps its own base opacity
    const fade = Math.max(0, 1 - sp * 0.9);
    panels.forEach(m => { m.material.opacity = 0.96 * fade; });
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
