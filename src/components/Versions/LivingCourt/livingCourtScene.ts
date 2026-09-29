import * as THREE from "three";
import {
  canvas,
  canvasTexture,
  damp,
  disposeScene,
  glowTexture,
  mulberry32,
  noise2D,
  prefersReducedMotion,
  renderRatio,
  smooth,
} from "../shared/three-utils";

export const BG = "#2c2936";

const n1 = noise2D(71);
const n2 = noise2D(72);

/* Mound height: two humps, sloping away at the front edge. */
function groundY(x: number, z: number) {
  const hump =
    1.25 * Math.exp(-((x - 3.4) ** 2) / 9 - (z - 0.4) ** 2 / 6) +
    0.9 * Math.exp(-((x + 5.2) ** 2) / 7 - (z + 0.2) ** 2 / 5) +
    0.35 * Math.exp(-((x + 0.5) ** 2) / 12 - (z - 2) ** 2 / 4);
  return -1.25 + hump + n1(x * 0.35, z * 0.35) * 0.22 - smooth(3, 6.5, z) * 2.4;
}

function texBall() {
  const { c, ctx } = canvas(1024, 512);
  const rnd = mulberry32(12);
  ctx.fillStyle = "#c65a2a";
  ctx.fillRect(0, 0, 1024, 512);
  for (let i = 0; i < 26000; i++) {
    ctx.fillStyle = `rgba(${rnd() > 0.5 ? "255,190,150" : "60,20,5"},${rnd() * 0.12})`;
    ctx.fillRect(rnd() * 1024, rnd() * 512, 2, 2);
  }
  ctx.strokeStyle = "#231109";
  ctx.lineWidth = 9;
  ctx.beginPath(); ctx.moveTo(0, 256); ctx.lineTo(1024, 256); ctx.stroke();
  for (const x of [256, 768]) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 512); ctx.stroke(); }
  for (const x0 of [0, 512]) {
    ctx.beginPath();
    for (let y = 0; y <= 512; y += 4) ctx.lineTo(x0 + 128 + Math.sin((y / 512) * Math.PI) * 100, y);
    ctx.stroke();
  }
  return canvasTexture(c);
}

/* Area-weighted surface sampler over a world-space mesh. */
function sampler(mesh: THREE.Mesh) {
  mesh.updateMatrixWorld(true);
  const g = mesh.geometry.index ? mesh.geometry.toNonIndexed() : mesh.geometry.clone();
  g.applyMatrix4(mesh.matrixWorld);
  const p = g.getAttribute("position") as THREE.BufferAttribute;
  const tris = p.count / 3;
  const cum = new Float32Array(tris);
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
  const ab = new THREE.Vector3(), ac = new THREE.Vector3();
  let total = 0;
  for (let i = 0; i < tris; i++) {
    a.fromBufferAttribute(p, i * 3); b.fromBufferAttribute(p, i * 3 + 1); c.fromBufferAttribute(p, i * 3 + 2);
    total += ab.subVectors(b, a).cross(ac.subVectors(c, a)).length() * 0.5;
    cum[i] = total;
  }
  return (rnd: () => number, outP: THREE.Vector3, outN: THREE.Vector3) => {
    const r = rnd() * total;
    let lo = 0, hi = tris - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cum[mid] < r) lo = mid + 1; else hi = mid;
    }
    a.fromBufferAttribute(p, lo * 3); b.fromBufferAttribute(p, lo * 3 + 1); c.fromBufferAttribute(p, lo * 3 + 2);
    let u = rnd(), v = rnd();
    if (u + v > 1) { u = 1 - u; v = 1 - v; }
    outP.copy(a).addScaledVector(ab.subVectors(b, a), u).addScaledVector(ac.subVectors(c, a), v);
    outN.copy(ab).cross(ac).normalize();
  };
}

/* Sweep a tube along a curve with a tapering, lumpy radius. */
function rootTube(pts: THREE.Vector3[], r0: number, r1: number, seg: number) {
  const curve = new THREE.CatmullRomCurve3(pts, false, "centripetal");
  const radial = 28;
  const g = new THREE.TubeGeometry(curve, seg, 1, radial, false);
  const pos = g.getAttribute("position") as THREE.BufferAttribute;
  const center = new THREE.Vector3(), v = new THREE.Vector3();
  for (let i = 0; i <= seg; i++) {
    const t = i / seg;
    curve.getPointAt(t, center);
    for (let j = 0; j <= radial; j++) {
      const k = i * (radial + 1) + j;
      v.fromBufferAttribute(pos, k).sub(center);
      const lump = 1 + 0.18 * n2(t * 9, j * 0.35) + 0.08 * n1(t * 30, j * 0.9);
      const flare = 1 + 0.6 * smooth(0.12, 0, t) + 0.5 * smooth(0.88, 1, t);
      v.multiplyScalar((r0 + (r1 - r0) * Math.sin(t * Math.PI)) * lump * flare);
      pos.setXYZ(k, center.x + v.x, center.y + v.y, center.z + v.z);
    }
  }
  g.computeVertexNormals();
  return g;
}

export type LivingCourt = {
  setPointerNdc: (x: number, y: number, inside: boolean) => void;
  setActive: (on: boolean) => void;
  dispose: () => void;
};

export function createLivingCourt(canvasEl: HTMLCanvasElement): LivingCourt {
  const reduced = prefersReducedMotion();
  const mobile = innerWidth < 700;

  const renderer = new THREE.WebGLRenderer({ canvas: canvasEl, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(BG, 13, 27);
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  const baseCam = new THREE.Vector3(0, 3.2, 13);
  const look = new THREE.Vector3(0, 2.6, 0);

  scene.add(new THREE.HemisphereLight("#d9ccff", "#1b1426", 1.1));
  const key = new THREE.DirectionalLight("#fff1e0", 2.2);
  key.position.set(-6, 10, 6);
  scene.add(key);
  const rim = new THREE.DirectionalLight("#8f7bff", 1.4);
  rim.position.set(6, 3, -8);
  scene.add(rim);

  const underMoss = new THREE.MeshStandardMaterial({ color: "#1d1729", roughness: 1 });

  /* Ground */
  const groundGeo = new THREE.PlaneGeometry(22, 12, 160, 90);
  groundGeo.rotateX(-Math.PI / 2);
  groundGeo.translate(0, 0, -1);
  {
    const p = groundGeo.getAttribute("position") as THREE.BufferAttribute;
    for (let i = 0; i < p.count; i++) p.setY(i, groundY(p.getX(i), p.getZ(i)));
    groundGeo.computeVertexNormals();
  }
  const ground = new THREE.Mesh(groundGeo, underMoss);
  scene.add(ground);

  /* The arch: a mossed root sweeping over the ball, plus an offshoot. */
  const archGeo = rootTube(
    [
      new THREE.Vector3(-8.4, groundY(-8.4, -0.4) - 0.4, -0.4),
      new THREE.Vector3(-6.4, 1.9, -1.0),
      new THREE.Vector3(-3.4, 3.8, -1.9),
      new THREE.Vector3(0.3, 4.3, -2.6),
      new THREE.Vector3(3.6, 3.4, -3.0),
      new THREE.Vector3(6.2, 1.3, -2.9),
      new THREE.Vector3(7.8, groundY(7.8, -2.5) - 0.5, -2.5),
    ],
    0.62, 0.52, 260,
  );
  const arch = new THREE.Mesh(archGeo, underMoss);
  scene.add(arch);
  const shootGeo = rootTube(
    [
      new THREE.Vector3(-5.9, 2.3, -1.1),
      new THREE.Vector3(-5.0, 1.1, 0.2),
      new THREE.Vector3(-4.0, 0.0, 1.2),
      new THREE.Vector3(-3.0, groundY(-3, 1.8) - 0.3, 1.8),
    ],
    0.3, 0.26, 90,
  );
  const shoot = new THREE.Mesh(shootGeo, underMoss);
  scene.add(shoot);

  /* The ball, sunk into the mound, moss grown over its crown. */
  const ballR = 1.55;
  const ball = new THREE.Mesh(
    new THREE.SphereGeometry(ballR, 96, 64),
    new THREE.MeshStandardMaterial({ map: texBall(), roughness: 0.78 }),
  );
  ball.position.set(3.1, groundY(3.1, 0.9) + ballR - 0.35, 0.9);
  ball.rotation.set(0.5, -0.8, 0.25);
  scene.add(ball);

  /* ── blades ── */
  const N = reduced ? 30000 : mobile ? 45000 : 120000;
  const bladeU = THREE.UniformsUtils.merge([
    THREE.UniformsLib.fog,
    {
      uTime: { value: 0 },
      uGrow: { value: reduced ? 1 : 0 },
      uPtr: { value: new THREE.Vector3(0, -99, 0) },
      uPtrOn: { value: 0 },
      uLight: { value: new THREE.Vector3(-0.5, 0.8, 0.4).normalize() },
    },
  ]);
  const blades = (() => {
    const base = new THREE.BufferGeometry();
    base.setAttribute("position", new THREE.Float32BufferAttribute(
      [-1, 0, 0, 1, 0, 0, -0.75, 0.33, 0, 0.75, 0.33, 0, -0.45, 0.66, 0, 0.45, 0.66, 0, 0, 1, 0], 3));
    base.setIndex([0, 1, 2, 2, 1, 3, 2, 3, 4, 4, 3, 5, 4, 5, 6]);
    const g = new THREE.InstancedBufferGeometry();
    g.index = base.index;
    g.attributes.position = base.attributes.position;
    const root = new Float32Array(N * 3);
    const nrm = new Float32Array(N * 3);
    const prm = new Float32Array(N * 4);
    const rnd = mulberry32(5);
    const sG = sampler(ground), sA = sampler(arch), sS = sampler(shoot), sB = sampler(ball);
    const P = new THREE.Vector3(), Nn = new THREE.Vector3();
    let i = 0, guard = 0;
    while (i < N && guard++ < N * 6) {
      const r = rnd();
      let type: number;
      if (r < 0.46) { sG(rnd, P, Nn); type = 0; }
      else if (r < 0.8) { sA(rnd, P, Nn); type = 1; }
      else if (r < 0.86) { sS(rnd, P, Nn); type = 1; }
      else { sB(rnd, P, Nn); type = 2; }
      // Moss caps what faces the sky; the line frays with noise.
      if (type === 1 && Nn.y < -0.35 + n1(P.x * 1.4, P.z * 1.4 + P.y) * 0.35) continue;
      if (type === 2 && Nn.y < 0.55 + n2(P.x * 2, P.z * 2) * 0.22) continue;
      if (type === 0 && (P.z > 4.2 || Math.abs(P.x) > 10.5)) continue;
      root.set([P.x, P.y, P.z], i * 3);
      nrm.set([Nn.x, Nn.y, Nn.z], i * 3);
      const long = rnd() < 1 / 16 ? 1.9 : 1;
      const len = type === 0 ? (0.2 + rnd() * 0.22) * long : type === 1 ? (0.1 + rnd() * 0.12) * long : 0.045 + rnd() * 0.06;
      prm.set([len, rnd() * Math.PI * 2, rnd(), type], i * 4);
      i++;
    }
    g.instanceCount = i;
    g.setAttribute("aRoot", new THREE.InstancedBufferAttribute(root, 3));
    g.setAttribute("aN", new THREE.InstancedBufferAttribute(nrm, 3));
    g.setAttribute("aP", new THREE.InstancedBufferAttribute(prm, 4));
    const m = new THREE.ShaderMaterial({
      uniforms: bladeU,
      fog: true,
      side: THREE.DoubleSide,
      vertexShader: `
        #include <common>
        #include <fog_pars_vertex>
        attribute vec3 aRoot; attribute vec3 aN; attribute vec4 aP;
        uniform float uTime, uGrow, uPtrOn; uniform vec3 uPtr, uLight;
        varying float vH; varying float vSeed; varying float vLit; varying float vPush;
        void main(){
          float h = position.y;
          vH = h; vSeed = aP.z;
          vec3 up = normalize(mix(aN, vec3(0.0, 1.0, 0.0), 0.3));
          vec3 side = normalize(cross(up, vec3(cos(aP.y), 0.13, sin(aP.y))));
          float delay = clamp((aRoot.x + 9.0) / 18.0, 0.0, 1.0) * 0.45 + aP.z * 0.2;
          float grow = smoothstep(delay, delay + 0.4, uGrow);
          float len = aP.x * grow;
          float wid = 0.016 * (aP.w > 0.5 ? 0.8 : 1.0);

          vec3 wind = vec3(sin(uTime * 1.2 + aRoot.x * 0.7 + aRoot.z * 0.4 + aP.z * 6.0),
                           0.0,
                           cos(uTime * 0.9 + aRoot.x * 0.5)) * 0.18;
          vec3 d = aRoot - uPtr;
          float dist = length(d);
          float f = (1.0 - smoothstep(0.1, 1.25, dist)) * uPtrOn;
          vec3 away = d - up * dot(d, up);
          away = length(away) > 1e-4 ? normalize(away) : side;
          vec3 bend = wind * (1.0 - f) + away * f * 1.4;
          vPush = f;

          vec3 p = aRoot + up * h * len + side * position.x * wid * (1.0 - 0.5 * h);
          p += bend * h * h * len * 1.6;
          p -= up * f * h * h * len * 0.55;

          vLit = 0.45 + 0.55 * max(dot(up, uLight), 0.0);
          vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,
      fragmentShader: `
        #include <common>
        #include <fog_pars_fragment>
        varying float vH; varying float vSeed; varying float vLit; varying float vPush;
        void main(){
          vec3 rootC = mix(vec3(0.05, 0.035, 0.1), vec3(0.11, 0.07, 0.2), vSeed);
          vec3 tipC = mix(vec3(0.36, 0.28, 0.78), vec3(0.74, 0.66, 1.0), vSeed * vSeed);
          if (vSeed > 0.975) tipC = vec3(1.0, 0.3, 0.42);
          vec3 col = mix(rootC, tipC, smoothstep(0.0, 1.0, vH)) * vLit;
          col += vec3(1.0, 0.55, 0.65) * vPush * vH * 0.35;
          gl_FragColor = vec4(col, 1.0);
          #include <fog_fragment>
        }`,
    });
    const mesh = new THREE.Mesh(g, m);
    mesh.frustumCulled = false;
    return mesh;
  })();
  scene.add(blades);

  /* Florets sit on the moss crown. */
  const florets = (() => {
    const M = 1600;
    const pos = new Float32Array(M * 3);
    const col = new Float32Array(M * 3);
    const rnd = mulberry32(8);
    const sA = sampler(arch), sB = sampler(ball);
    const P = new THREE.Vector3(), Nn = new THREE.Vector3();
    const white = new THREE.Color("#f6f1ff"), rose = new THREE.Color("#ff4d6d");
    let i = 0, guard = 0;
    while (i < M && guard++ < M * 20) {
      if (rnd() < 0.8) sA(rnd, P, Nn); else sB(rnd, P, Nn);
      if (Nn.y < 0.45) continue;
      P.addScaledVector(Nn, 0.14);
      pos.set([P.x, P.y, P.z], i * 3);
      const c = rnd() < 0.18 ? rose : white;
      col.set([c.r, c.g, c.b], i * 3);
      i++;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos.subarray(0, i * 3), 3));
    g.setAttribute("color", new THREE.BufferAttribute(col.subarray(0, i * 3), 3));
    return new THREE.Points(g, new THREE.PointsMaterial({ size: 0.06, vertexColors: true, map: glowTexture(), transparent: true, depthWrite: false, alphaTest: 0.05 }));
  })();
  scene.add(florets);

  /* Dust motes drifting through the scene. */
  const motes = (() => {
    const M = 500;
    const pos = new Float32Array(M * 3);
    const rnd = mulberry32(3);
    for (let i = 0; i < M; i++) pos.set([(rnd() - 0.5) * 24, rnd() * 9 - 1, (rnd() - 0.5) * 12 - 2], i * 3);
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return new THREE.Points(g, new THREE.PointsMaterial({ size: 0.035, color: "#d8ccff", map: glowTexture(), transparent: true, opacity: 0.55, depthWrite: false }));
  })();
  scene.add(motes);

  /* Pointer spray: a short spark trail where the pointer brushes the moss. */
  const SP = 260;
  const spPos = new Float32Array(SP * 3).fill(-99);
  const spVel = new Float32Array(SP * 3);
  const spLife = new Float32Array(SP);
  const spray = (() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(spPos, 3));
    const p = new THREE.Points(g, new THREE.PointsMaterial({
      size: 0.09, color: "#ffc7d2", map: glowTexture("rgba(255,255,255,1)", "rgba(255,120,150,0.4)"),
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    }));
    p.frustumCulled = false;
    return p;
  })();
  scene.add(spray);
  let spHead = 0;

  /* ── pointer → world via raycast onto the mossed surfaces ── */
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2(10, 10);
  const hit = new THREE.Vector3();
  const hitN = new THREE.Vector3();
  const smoothPtr = new THREE.Vector3(0, -99, 0);
  let inside = false;
  let ptrOn = 0;
  let hasHit = false;
  const lastHit = new THREE.Vector3();
  const par = { x: 0, y: 0, sx: 0, sy: 0 };
  const targets = [ball, arch, shoot, ground];

  const resize = () => {
    const w = canvasEl.clientWidth, h = canvasEl.clientHeight;
    if (!w || !h) return;
    renderer.setPixelRatio(renderRatio(w));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const fit = Math.min(24, 13 / Math.min(1, camera.aspect / 1.35));
    const shift = camera.aspect < 0.9 ? 2.2 : 0;
    baseCam.set(shift, 3.2 + (fit - 13) * 0.05, fit);
    look.x = shift;
    const fog = scene.fog as THREE.Fog;
    fog.near = fit;
    fog.far = fit + 14;
    camera.updateProjectionMatrix();
  };
  const ro = new ResizeObserver(resize);
  ro.observe(canvasEl);
  resize();

  let raf = 0, last = performance.now(), time = 0, active = true;
  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!active) return;
    time += dt;

    par.sx = damp(par.sx, par.x, 2.4, dt);
    par.sy = damp(par.sy, par.y, 2.4, dt);
    camera.position.set(baseCam.x + par.sx * 0.7, baseCam.y - par.sy * 0.35, baseCam.z);
    camera.lookAt(look);
    camera.updateMatrixWorld();

    hasHit = false;
    if (inside) {
      ray.setFromCamera(ndc, camera);
      const h = ray.intersectObjects(targets, false)[0];
      if (h) {
        hasHit = true;
        hit.copy(h.point);
        hitN.copy(h.face?.normal ?? new THREE.Vector3(0, 1, 0)).transformDirection(h.object.matrixWorld);
      }
    }
    ptrOn = damp(ptrOn, hasHit && !reduced ? 1 : 0, 6, dt);
    if (hasHit) {
      if (smoothPtr.y < -50) smoothPtr.copy(hit);
      smoothPtr.lerp(hit, 1 - Math.exp(-14 * dt));
      const moved = lastHit.distanceTo(hit);
      if (moved > 0.02 && !reduced) {
        const count = Math.min(4, 1 + Math.floor(moved * 12));
        for (let k = 0; k < count; k++) {
          const i = spHead;
          spHead = (spHead + 1) % SP;
          spPos.set([hit.x + hitN.x * 0.2, hit.y + hitN.y * 0.2, hit.z + hitN.z * 0.2], i * 3);
          spVel.set([(Math.random() - 0.5) * 0.9 + hitN.x * 0.6, 0.6 + Math.random() * 0.9, (Math.random() - 0.5) * 0.9 + hitN.z * 0.6], i * 3);
          spLife[i] = 1;
        }
      }
      lastHit.copy(hit);
    }
    for (let i = 0; i < SP; i++) {
      if (spLife[i] <= 0) continue;
      spLife[i] -= dt * 0.9;
      spVel[i * 3 + 1] -= dt * 0.8;
      spPos[i * 3] += spVel[i * 3] * dt;
      spPos[i * 3 + 1] += spVel[i * 3 + 1] * dt;
      spPos[i * 3 + 2] += spVel[i * 3 + 2] * dt;
      if (spLife[i] <= 0) spPos[i * 3 + 1] = -99;
    }
    spray.geometry.attributes.position.needsUpdate = true;

    bladeU.uTime.value = reduced ? 2 : time;
    bladeU.uGrow.value = reduced ? 1 : Math.min(1.2, time / 2.6);
    bladeU.uPtr.value.copy(smoothPtr);
    bladeU.uPtrOn.value = ptrOn;
    motes.rotation.y = Math.sin(time * 0.05) * 0.08;
    motes.position.y = Math.sin(time * 0.3) * 0.15;

    renderer.render(scene, camera);
  };
  raf = requestAnimationFrame(frame);

  return {
    setPointerNdc: (x, y, isIn) => {
      ndc.set(x, y);
      inside = isIn;
      par.x = isIn ? x : 0;
      par.y = isIn ? -y : 0;
    },
    setActive: (on) => {
      active = on;
      last = performance.now();
    },
    dispose: () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      disposeScene(scene);
      renderer.dispose();
    },
  };
}
